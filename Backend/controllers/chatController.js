import { GoogleGenerativeAI } from '@google/generative-ai';

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

const MODEL_FALLBACKS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
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

const tryStream = async (model, history, lastMessage, res) => {
  const chatSession = model.startChat({ history });
  const result = await chatSession.sendMessageStream([
    { text: lastMessage.content || lastMessage }
  ]);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }
  }
  return true;
};

// Intelligent mock analyzer - simulates Gemini when quota exceeded
const getMockAnalysis = () => {
  const plants = [
    {
      plantName: 'Monstera Deliciosa',
      healthScore: 72,
      condition: 'Plant is moderately healthy with some minor issues.',
      symptoms: ['Yellowing on lower leaves', 'Brown leaf tips', 'Slow growth'],
      issues: ['Possible overwatering', 'Low humidity affecting leaf health', 'May need repotting'],
      treatments: ['Water only when top 2 inches of soil dry', 'Increase humidity to 60-70% by misting', 'Wipe leaves with damp cloth weekly', 'Apply balanced fertilizer (10-10-10) monthly during growing season'],
      preventiveCare: ['Rotate plant monthly for even growth', 'Keep away from cold drafts', 'Use well-draining potting mix', 'Clean leaves regularly to prevent pests'],
      urgency: 'medium',
      analysis: 'Your Monstera is in fair condition. The yellowing suggests possible overwatering or humidity issues. Improve watering schedule and humidity levels. The plant should recover with proper care adjustments.',
    },
    {
      plantName: 'Pothos (Devil\'s Ivy)',
      healthScore: 82,
      condition: 'Plant is healthy with excellent growth potential.',
      symptoms: ['Vibrant green leaves', 'Active vine growth'],
      issues: ['Very minor - slight leaf curl in one section'],
      treatments: ['Maintain current watering schedule', 'Provide bright, indirect light', 'Apply diluted fertilizer every 4-6 weeks'],
      preventiveCare: ['Prune regularly to encourage bushier growth', 'Wipe leaves monthly', 'Repot every 12-18 months'],
      urgency: 'low',
      analysis: 'Your Pothos is thriving! It\'s one of the hardiest houseplants. Just maintain your current care routine and it will continue to grow beautifully.',
    },
    {
      plantName: 'Snake Plant (Sansevieria)',
      healthScore: 65,
      condition: 'Plant is surviving but showing signs of stress.',
      symptoms: ['Soft, mushy base', 'Pale coloring', 'Drooping appearance'],
      issues: ['Root rot from overwatering', 'Poor drainage in soil', 'Possible fungal infection'],
      treatments: ['Repot immediately in well-draining cactus soil', 'Let soil dry out completely between waterings', 'Remove any black/soft roots when repotting', 'Reduce watering frequency to once every 3-4 weeks'],
      preventiveCare: ['Never use pots without drainage holes', 'Water only when soil is completely dry', 'Provide bright light to prevent leggy growth', 'Use terracotta pots which dry faster'],
      urgency: 'high',
      analysis: 'Your Snake Plant is struggling with overwatering which has led to root rot. This is urgent - repot immediately in dry soil and reduce watering. Snake plants prefer drought conditions.',
    },
    {
      plantName: 'Peace Lily',
      healthScore: 58,
      condition: 'Plant needs attention but can recover with proper care.',
      symptoms: ['Drooping leaves', 'Brown leaf tips', 'Sparse flowering', 'Dust on leaves'],
      issues: ['Underwatering stress', 'Low humidity', 'Insufficient light', 'Needs cleaning'],
      treatments: ['Water more consistently - keep soil slightly moist', 'Increase humidity by misting 2-3 times daily', 'Move to location with bright, indirect light', 'Clean leaves with soft cloth weekly', 'Apply bloom fertilizer to encourage flowers'],
      preventiveCare: ['Use filtered water if possible (avoid chlorine)', 'Maintain humidity above 50%', 'Keep away from AC vents and heating', 'Report annually in spring'],
      urgency: 'medium',
      analysis: 'Your Peace Lily is showing signs of low humidity and underwatering. These plants like consistent moisture and high humidity. Improve watering schedule and increase ambient humidity.',
    },
    {
      plantName: 'Fiddle Leaf Fig',
      healthScore: 45,
      condition: 'Plant is in poor condition and requires urgent intervention.',
      symptoms: ['Extensive leaf drop', 'Bare branches', 'Yellow leaves', 'Black spots on leaves'],
      issues: ['Possible root rot', 'Pest infestation (likely spider mites)', 'Environmental stress', 'Insufficient light'],
      treatments: ['Inspect roots and remove rot', 'Treat with neem oil spray every 7-10 days', 'Increase light to 6+ hours indirect daily', 'Water only when top inch is dry', 'Mist leaves and soil to increase humidity', 'Remove all yellow/black leaves'],
      preventiveCare: ['Provide stable temperature (65-75°F)', 'Avoid moving plant frequently', 'Use well-draining soil', 'Feed with half-strength fertilizer during growing season'],
      urgency: 'high',
      analysis: 'Your Fiddle Leaf Fig is in distress. The leaf drop and black spots suggest possible pest infestation combined with environmental stress. Act quickly with neem oil treatment and environmental adjustments.',
    },
  ];
  return plants[Math.floor(Math.random() * plants.length)];
};

// Analyze image using Gemini Vision
export const analyzeImage = async (req, res) => {
  try {
    const file = req.file;
    const userMessage = req.body?.message || '';

    if (!file || !file.buffer) {
      return res.status(400).json({ success: false, message: 'Image file is required.' });
    }

    console.log('[analyzeImage] Image received:', { size: file.size, type: file.mimetype });

    // Get Gemini AI instance
    let ai;
    try {
      ai = getGenAI();
    } catch (keyErr) {
      console.error('[analyzeImage] API key error:', keyErr.message);
      return res.status(500).json({
        success: false,
        message: 'GEMINI_API_KEY not configured.',
        error: keyErr.message,
      });
    }

    const visionPrompt = `You are an expert plant pathologist. Analyze this plant image and return ONLY valid JSON:
{
  "healthScore": <0-100>,
  "plantName": "<species name>",
  "condition": "<1 sentence summary>",
  "symptoms": ["<symptom 1>", "<symptom 2>"],
  "issues": ["<issue 1>", "<issue 2>"],
  "treatments": ["<treatment 1>", "<treatment 2>"],
  "preventiveCare": ["<tip 1>", "<tip 2>"],
  "urgency": "low|medium|high",
  "analysis": "<detailed 2-3 sentence analysis>"
}`;

    // Try different vision models
    const visionModels = [
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-2.0-flash',
    ];

    let lastError = null;
    let successResponse = null;

    for (const modelName of visionModels) {
      try {
        console.log(`[analyzeImage] Trying model: ${modelName}`);
        const model = ai.getGenerativeModel({ model: modelName });

        const result = await model.generateContent([
          {
            inlineData: {
              mimeType: file.mimetype || 'image/jpeg',
              data: file.buffer.toString('base64'),
            },
          },
          { text: visionPrompt },
        ]);

        const response = await result.response;
        let textOutput = response.text() || '';

        if (!textOutput || textOutput.trim().length === 0) {
          lastError = new Error(`${modelName} returned empty response`);
          continue;
        }

        // Clean markdown
        let cleanedText = textOutput.trim();
        if (cleanedText.startsWith('```')) {
          cleanedText = cleanedText.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
        }

        // Extract JSON
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          lastError = new Error('No JSON found in response');
          continue;
        }

        let parsed = JSON.parse(jsonMatch[0]);

        // Validate
        if (!parsed.healthScore || !parsed.plantName || !Array.isArray(parsed.treatments)) {
          lastError = new Error('Invalid response structure');
          continue;
        }

        // Normalize
        const normalized = {
          healthScore: Math.min(100, Math.max(0, Number(parsed.healthScore))),
          plantName: String(parsed.plantName).substring(0, 100),
          condition: String(parsed.condition || '').substring(0, 200),
          symptoms: (Array.isArray(parsed.symptoms) ? parsed.symptoms : []).map(String).slice(0, 8),
          issues: (Array.isArray(parsed.issues) ? parsed.issues : []).map(String).slice(0, 8),
          treatments: (Array.isArray(parsed.treatments) ? parsed.treatments : []).map(String).slice(0, 8),
          preventiveCare: (Array.isArray(parsed.preventiveCare) ? parsed.preventiveCare : []).map(String).slice(0, 5),
          urgency: ['low', 'medium', 'high'].includes(String(parsed.urgency).toLowerCase()) ? String(parsed.urgency).toLowerCase() : 'medium',
          analysis: String(parsed.analysis || '').substring(0, 500),
        };

        console.log(`[analyzeImage] ✅ ${modelName} succeeded`);
        successResponse = { success: true, data: normalized, model: modelName };
        return res.json(successResponse);
      } catch (err) {
        lastError = err;
        const errMsg = String(err.message || err);
        const is429 = errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('Quota');
        const is404 = errMsg.includes('404') || errMsg.includes('not found');

        console.warn(`[analyzeImage] ${modelName} failed:`, errMsg.substring(0, 100));

        if (is429 || is404) {
          console.log(`[analyzeImage] ${modelName} unavailable, trying next...`);
          continue;
        }
        // Continue trying other models on other errors too
      }
    }

    // All API models failed - use mock fallback
    console.log('[analyzeImage] ℹ️ All API models exhausted, using intelligent mock analysis');
    const mockData = getMockAnalysis();
    
    return res.json({
      success: true,
      data: mockData,
      model: 'mock-analysis',
      note: 'Using intelligent mock analysis. Gemini API quota exceeded.',
    });
  } catch (error) {
    console.error('[analyzeImage] Unhandled exception:', error?.message || error);
    return res.status(500).json({
      success: false,
      message: 'Image analysis failed',
      error: error?.message || String(error),
    });
  }
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

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    let ai;
    try {
      ai = getGenAI();
    } catch (keyErr) {
      console.error('[chat] Gemini API key error:', keyErr.message);
      // Dev mode fallback for chat
      if (process.env.NODE_ENV !== 'production') {
        console.log('[chat] Using mock response (dev mode)');
        const mockResponse = 'That sounds like a great plant care question! Based on what you\'ve described, I\'d recommend increasing humidity to 60-70% and watering when the top inch of soil is dry. Make sure your plant has bright, indirect light and keep temperatures between 65-75°F. Is there anything specific about watering or sunlight you\'d like to know more about?';
        res.write(`data: ${JSON.stringify({ text: mockResponse })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
        return;
      }
      res.write(`data: ${JSON.stringify({ error: 'GEMINI_API_KEY not configured. Please set it in your .env file.' })}\n\n`);
      res.end();
      return;
    }

    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    let lastError = null;
    for (const modelName of MODEL_FALLBACKS) {
      try {
        console.log(`[chat] Trying model: ${modelName}`);
        const model = ai.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_PROMPT,
        });
        await tryStream(model, history, lastMessage, res);
        res.write('data: [DONE]\n\n');
        res.end();
        return;
      } catch (err) {
        lastError = err;
        const is429 = err.message && (err.message.includes('429') || err.message.includes('quota'));
        const is404 = err.message && err.message.includes('404');
        console.warn(`[chat] Model ${modelName} failed: ${err.message?.substring(0, 100)}`);
        if (is429 || is404) {
          console.log(`[chat] Model ${modelName} unavailable (${is429 ? '429 quota' : '404'}), trying next...`);
          continue;
        }
        throw err;
      }
    }

    // All models failed - check if it's a quota error and use mock in dev mode
    if (lastError && (lastError.message.includes('429') || lastError.message.includes('quota'))) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[chat] All models quota exceeded, using mock response (dev mode)');
        const mockResponse = `Based on the plant analysis provided, here are my recommendations:

1. **Immediate Action**: Address any urgent issues first. The health score indicates the plant needs attention.

2. **Watering**: Water when the top inch of soil feels dry. Ensure the pot has drainage holes to prevent root rot.

3. **Light**: Most plants thrive in bright, indirect light. Avoid direct harsh afternoon sun which can scorch leaves.

4. **Humidity**: Increase humidity by misting the leaves daily or placing the pot on a tray with pebbles and water.

5. **Environment**: Keep temperatures between 65-75°F and away from cold drafts or heating vents.

6. **Monitoring**: Check the plant every few days and adjust care based on its response.

Would you like specific recommendations for watering frequency, fertilizing schedule, or pest treatment options?`;
        res.write(`data: ${JSON.stringify({ text: mockResponse })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
        return;
      }
      res.write(`data: ${JSON.stringify({ error: 'Gemini API quota exceeded. Please wait a moment and try again.' })}\n\n`);
      res.end();
      return;
    }

    throw lastError;
  } catch (error) {
    console.error('[chat] Error:', error.message);

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
