import { GoogleGenerativeAI } from '@google/generative-ai';

// Lazy init — read key at request time, not module load (avoids ES module hoisting issue)
let genAI = null;
const getGenAI = () => {
  if (!genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'your_gemini_api_key_here') {
      throw new Error('GEMINI_API_KEY is not set in .env');
    }
    genAI = new GoogleGenerativeAI(key);
  }
  return genAI;
};

// Models tried in order — each has its own free-tier quota bucket
// Only models confirmed available via ListModels for this API key
const MODEL_FALLBACKS = [
  'gemini-2.5-flash',       // highest capability, separate quota
  'gemini-2.0-flash-lite',  // lightest, most generous quota
  'gemini-2.0-flash',       // standard model
];

const SYSTEM_PROMPT = `You are Leafy, a warm, friendly, and highly knowledgeable plant care assistant for the Leafy Plant Store.

Your expertise covers:
- Watering: Schedules, amounts, techniques (bottom-watering, misting, etc.)
- Sunlight: Specific light requirements for all plant types
- Soil: Composition, drainage, repotting techniques and timing
- Fertilising: Types, schedules, and dosages for different plants
- Pest control: Identifying and treating common pests (aphids, spider mites, fungus gnats, etc.)
- Plant diseases: Diagnosing yellowing leaves, root rot, leaf drop, etc.
- Indoor plants: Monstera, Pothos, Snake Plant, Peace Lily, Fiddle Leaf Fig, and more
- Outdoor plants: Garden beds, seasonal care, frost protection
- Succulents and cacti: Drought care, propagation, repotting
- Humidity and temperature: Optimal conditions for tropical vs desert plants

Your personality:
- Warm, encouraging, and never condescending
- Give SPECIFIC, actionable advice, never vague
- Use plant emojis occasionally to keep things friendly
- Keep responses concise but complete
- If someone is a beginner, be extra encouraging and suggest easy-care plants
- If asked about anything unrelated to plants, politely redirect back to plant topics

Always end responses with a follow-up question or tip to keep the conversation going.`;

// Try to stream from a model; returns true on success, false on quota error
const tryStream = async (model, history, lastMessage, res) => {
  const chatSession = model.startChat({ history });
  const result = await chatSession.sendMessageStream(lastMessage.content);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }
  }
  return true;
};

export const chat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Messages array is required and cannot be empty.',
      });
    }

    // SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const ai = getGenAI();

    // Map frontend {role, content} to Gemini {role, parts: [{text}]}
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    // Try each model in order until one succeeds
    let lastError = null;
    for (const modelName of MODEL_FALLBACKS) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = ai.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_PROMPT,
        });
        await tryStream(model, history, lastMessage, res);
        res.write('data: [DONE]\n\n');
        res.end();
        return; // success — exit
      } catch (err) {
        lastError = err;
        const is429 = err.message && err.message.includes('429');
        const is404 = err.message && err.message.includes('404');
        if (is429 || is404) {
          console.log(`Model ${modelName} unavailable (${is429 ? '429' : '404'}), trying next...`);
          continue; // try next model
        }
        throw err; // unexpected error — stop trying
      }
    }

    // All models failed
    throw lastError;

  } catch (error) {
    console.error('Chat Error:', error.message);

    let userMessage = 'Something went wrong. Please try again.';
    if (error.message && error.message.includes('429')) {
      userMessage = 'All AI models are currently rate-limited. Please wait 1 minute and try again.';
    } else if (error.message && (error.message.includes('API_KEY_INVALID') || error.message.includes('API key not valid'))) {
      userMessage = 'Invalid API key. Please check GEMINI_API_KEY in your .env file.';
    } else if (error.message && error.message.includes('GEMINI_API_KEY is not set')) {
      userMessage = 'Gemini API key is not configured on the server.';
    }

    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: userMessage });
    }
    res.write(`data: ${JSON.stringify({ error: userMessage })}\n\n`);
    res.end();
  }
};
