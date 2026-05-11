import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Leaf, RotateCcw, Bot, User, AlertCircle } from 'lucide-react';
import '../styles/PlantCare.css';

const API_BASE_URL = 'http://localhost:5000/api';

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi there! I'm Leafy, your personal plant care assistant! I can help you with watering schedules, sunlight needs, soil tips, pest problems, and anything else your green friends might need. What plant question can I help you with today?",
};

// Diagnosis Card Component
const DiagnosisCard = ({ data }) => {
  if (!data) return null;

  const healthColor = 
    data.healthScore >= 80 ? '#22c55e' :
    data.healthScore >= 50 ? '#eab308' :
    '#ef4444';

  const urgencyBadgeClass = `urgency-badge urgency-${data.urgency || 'low'}`;

  return (
    <div className="diagnosis-card">
      <div className="diagnosis-header">
        <h3 className="diagnosis-plant-name">🌿 {data.plantName || 'Unknown Plant'}</h3>
        <span className={urgencyBadgeClass}>{(data.urgency || 'low').toUpperCase()}</span>
      </div>

      <div className="diagnosis-health">
        <div className="health-info">
          <span className="health-label">Health Score</span>
          <span className="health-value">{data.healthScore || 50}%</span>
        </div>
        <div className="health-bar-container">
          <div 
            className="health-bar-fill" 
            style={{ 
              width: `${data.healthScore || 50}%`,
              backgroundColor: healthColor
            }}
          />
        </div>
      </div>

      {data.condition && (
        <p className="diagnosis-condition">{data.condition}</p>
      )}

      {data.symptoms && data.symptoms.length > 0 && (
        <div className="diagnosis-section">
          <h4 className="section-title">📋 Symptoms</h4>
          <ul className="diagnosis-list">
            {data.symptoms.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}

      {data.issues && data.issues.length > 0 && (
        <div className="diagnosis-section">
          <h4 className="section-title">⚠️ Issues</h4>
          <ul className="diagnosis-list">
            {data.issues.map((issue, i) => <li key={i}>{issue}</li>)}
          </ul>
        </div>
      )}

      {data.treatments && data.treatments.length > 0 && (
        <div className="diagnosis-section">
          <h4 className="section-title">💊 Treatments</h4>
          <ul className="diagnosis-list">
            {data.treatments.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      )}

      {data.preventiveCare && data.preventiveCare.length > 0 && (
        <div className="diagnosis-section">
          <h4 className="section-title">🛡️ Preventive Care</h4>
          <ul className="diagnosis-list">
            {data.preventiveCare.map((pc, i) => <li key={i}>{pc}</li>)}
          </ul>
        </div>
      )}

      {data.analysis && (
        <div className="diagnosis-analysis">
          <p>{data.analysis}</p>
        </div>
      )}
    </div>
  );
};

// Render basic markdown: **bold** and line-breaks
function renderContent(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.includes('\n')) {
      return part.split('\n').map((line, j, arr) => (
        <span key={`${i}-${j}`}>
          {line}
          {j < arr.length - 1 && <br />}
        </span>
      ));
    }
    return part;
  });
}

// Quick-tip data — all strings use double-quotes only
const TIPS = [
  {
    emoji: '💧',
    title: 'Watering',
    tip: "Check soil moisture before watering — stick your finger 2 cm in. If it is dry, water thoroughly.",
  },
  {
    emoji: '☀️',
    title: 'Sunlight',
    tip: 'Most houseplants love bright indirect light. Avoid harsh afternoon sun on delicate leaves.',
  },
  {
    emoji: '🌱',
    title: 'Soil',
    tip: 'Well-draining soil prevents root rot. Add perlite to potting mix for succulents and tropicals alike.',
  },
  {
    emoji: '🌡️',
    title: 'Temperature',
    tip: 'Keep most houseplants away from drafts and heaters. Ideal range is 15-27 degrees C (59-80 F).',
  },
  {
    emoji: '🧴',
    title: 'Fertilising',
    tip: 'Feed during the growing season (spring-summer) every 2-4 weeks with a balanced liquid fertiliser.',
  },
  {
    emoji: '🪲',
    title: 'Pest Check',
    tip: "Inspect leaf undersides weekly. Early detection saves your plant. Neem oil is your best friend.",
  },
];

const SUGGESTIONS = [
  '💧 How often should I water my Monstera?',
  '☀️ Best plants for low light rooms?',
  '🪲 My plant has yellow leaves — help!',
  '🌵 How do I care for succulents?',
];

function PlantCare() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const fileInputRef = useRef(null);

  // Scroll only the chat box, not the whole page
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = useCallback((file) => {
    if (!file) return;
    if (!file.type?.startsWith('image/')) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    handleFileSelect(file);
    e.target.value = '';
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer?.files && e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const uploadImage = async (file) => {
    setIsAnalyzing(true);
    setDiagnosis(null);
    // console.log('[PlantCare] Starting image analysis...');
    try {
      const form = new FormData();
      form.append('image', file);
      form.append('message', input || '');

      // console.log('[PlantCare] Sending image to backend:', {
      //   fileName: file?.name,
      //   fileSize: file?.size,
      //   fileType: file?.type,
      // });

      const resp = await fetch(`${API_BASE_URL}/chat/analyze-image`, {
        method: 'POST',
        body: form,
      });
      
      // console.log('[PlantCare] Backend response status:', resp.status);
      const json = await resp.json();
      // console.log('[PlantCare] Backend response:', json);

      if (!resp.ok) {
        const errMsg = json?.error || json?.raw || json?.message || `Server error ${resp.status}`;
        console.error('[PlantCare] Analysis error:', errMsg);
        setDiagnosis({ error: errMsg });
        return { success: false, error: errMsg };
      }
      if (!json.success) {
        const errMsg = json?.error || json?.raw || json?.message || 'Analysis failed';
        console.error('[PlantCare] Analysis unsuccessful:', errMsg);
        setDiagnosis({ error: errMsg });
        return { success: false, error: errMsg };
      }

      const data = json.data;
      // console.log('[PlantCare] Analysis successful:', data);
      setDiagnosis(data);

      // Create image preview URL
      const imageUrl = URL.createObjectURL(file);

      return { success: true, diagData: data, imageUrl };
    } catch (err) {
      // console.error('[PlantCare] Image analysis exception:', err);
      const errMsg = err.message || 'Analysis failed';
      setDiagnosis({ error: errMsg });
      return { success: false, error: errMsg };
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSend = async () => {
    // Allow sending if there's text OR an attached image
    const userTextRaw = input.trim();
    if (!userTextRaw && !selectedFile) return;
    if (isStreaming) return;

    // console.log('[PlantCare] handleSend called with:', {
    //   textLength: userTextRaw.length,
    //   hasImage: !!selectedFile,
    //   isAnalyzing,
    // });

    // If there's an attached image, analyze it first
    let diagData = null;
    let imageUrl = null;
    if (selectedFile && !isAnalyzing) {
      //console.log('[PlantCare] Analyzing attached image...');
      const res = await uploadImage(selectedFile);
      diagData = res?.diagData;
      imageUrl = res?.imageUrl;
      // clear selection after analysis attempt
      setSelectedFile(null);
      setPreviewUrl('');
      // console.log('[PlantCare] Image analysis result:', { success: res?.success, hasError: !!res?.error });
    }

    const history = messages
      .filter((m) => m.id !== 'welcome' && !m.id?.toString().startsWith('diag-'))
      .map((m) => ({ role: m.role, content: m.content }));

    const userText = userTextRaw || (imageUrl ? '' : 'Message');
    
    // Build the message content - include diagnosis context if available
    let finalUserContent = userText;
    if (diagData) {
      finalUserContent = `Plant Diagnosis:\nPlant: ${diagData.plantName}\nHealth: ${diagData.healthScore}%\nIssues: ${diagData.issues?.join(', ') || 'None'}\n\nFollow-up: ${userText}`;
    }

    // Create user message with image only (on sending side)
    const userMessage = { 
      id: Date.now(), 
      role: 'user', 
      content: userText,
      imageUrl // Store image URL for display on user side
    };
    
    // Create bot message with diagnosis data (on receive side)
    const botMessage = { 
      id: Date.now() + 1, 
      role: 'assistant', 
      content: '',
      diagnosis: diagData // Store diagnosis for display on bot side
    };

    // Add both messages to chat
    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput('');
    setIsStreaming(true);

    // For API: send history + user message (diagnosis context embedded in user message)
    const apiMessages = [...history, { role: 'user', content: finalUserContent }];

    // console.log('[PlantCare] Sending chat message with history length:', history.length);

    try {
      const controller = new AbortController();
      abortRef.current = controller;

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6);
          if (raw === '[DONE]') break;

          try {
            const parsed = JSON.parse(raw);
            if (parsed.error) {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  content: parsed.error,
                };
                return updated;
              });
              break;
            }
            if (parsed.text) {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  content: updated[updated.length - 1].content + parsed.text,
                };
                return updated;
              });
            }
          } catch {
            // skip malformed JSON chunks
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content:
            'Could not reach the plant care assistant. Please make sure the server is running and your Gemini API key is set.',
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    if (isStreaming) {
      abortRef.current?.abort();
    }
    setMessages([WELCOME_MESSAGE]);
    setInput('');
    setIsStreaming(false);
    inputRef.current?.focus();
  };

  const handleSuggestion = (text) => {
    if (isStreaming) return;
    setInput(text);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div className="plantcare-page">

      {/* Hero */}
      <section className="plantcare-hero">
        <div className="plantcare-hero-inner">
          <div className="plantcare-hero-badge">
            <Bot size={16} />
            <span>Powered by Google Gemini</span>
          </div>
          <h1 className="plantcare-hero-title">
            <Leaf size={36} />
            Plant Care Assistant
          </h1>
          <p className="plantcare-hero-sub">
            Ask Leafy anything about watering, sunlight, soil, pests, and more.
            Get expert personalised advice for all your plants instantly.
          </p>
        </div>
      </section>

      {/* Chat Card */}
      <section className="plantcare-chat-section">
        <div className="plantcare-chat-card">


          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chat-avatar bot-avatar">
                <span>🌿</span>
              </div>
              <div>
                <p className="chat-bot-name">Leafy</p>
                <p className="chat-bot-status">
                  <span className="status-dot" />
                  Plant Care Expert
                </p>
              </div>
            </div>
            <button
              className="chat-reset-btn"
              onClick={handleReset}
              title="Start a new conversation"
            >
              <RotateCcw size={16} />
              New Chat
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages" id="chat-messages" ref={chatBoxRef}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message-row ${msg.role === 'user' ? 'user-row' : 'bot-row'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="chat-avatar bot-avatar sm">🌿</div>
                )}

                <div
                  className={`chat-bubble ${msg.role === 'user' ? 'user-bubble' : 'bot-bubble'}`}
                >
                  {msg.content === '' && isStreaming ? (
                    <span className="typing-indicator">
                      <span />
                      <span />
                      <span />
                    </span>
                  ) : msg.role === 'user' && msg.imageUrl ? (
                    // For user message: show image thumbnail + text only
                    <div>
                      <img 
                        src={msg.imageUrl} 
                        alt="plant" 
                        className="chat-image-thumbnail"
                        style={{ maxWidth: '200px', borderRadius: '8px', marginBottom: '12px' }}
                      />
                      {msg.content && <p className="bubble-text">{renderContent(msg.content)}</p>}
                    </div>
                  ) : msg.role === 'assistant' && msg.diagnosis ? (
                    // For bot message: show diagnosis card
                    <DiagnosisCard data={msg.diagnosis} />
                  ) : (
                    <p className="bubble-text">{renderContent(msg.content)}</p>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="chat-avatar user-avatar sm">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}

          </div>

          {/* Suggestion Chips */}
          {messages.length === 1 && (
            <div className="suggestions-row">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  className="suggestion-chip"
                  onClick={() => handleSuggestion(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chat-input-area">
            <div
              className="attach-area"
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={(e) => {
                e.preventDefault();
                setIsDragActive(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragActive(false);
              }}
              onDrop={onDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{ display: 'none' }}
              />
              {previewUrl ? (
                <div className="attach-preview">
                  <img src={previewUrl} alt="preview" />
                  <button className="attach-remove" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setPreviewUrl(''); }}>✕</button>
                </div>
              ) : (
                <div className={`attach-placeholder ${isDragActive ? 'active' : ''}`} title="Attach image">📎</div>
              )}
            </div>

            <textarea
              ref={inputRef}
              id="plant-care-input"
              className="chat-textarea"
              rows={1}
              placeholder="Ask about watering, sunlight, soil, pests..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
            />
            <button
              id="plant-care-send"
              className={`chat-send-btn ${isStreaming ? 'loading' : ''}`}
              onClick={handleSend}
              disabled={isStreaming || (!input.trim() && !selectedFile)}
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="chat-hint">Press Enter to send &middot; Shift+Enter for new line</p>

        </div>
      </section>

      {/* Quick Tips */}
      <section className="plantcare-tips-section">
        <div className="tips-inner">
          <h2 className="tips-heading">Quick Care Reminders</h2>
          <p className="tips-subheading">Essential advice to keep every plant thriving</p>
          <div className="tips-grid">
            {TIPS.map(({ emoji, title, tip }) => (
              <div className="tip-card" key={title}>
                <span className="tip-emoji">{emoji}</span>
                <h3 className="tip-title">{title}</h3>
                <p className="tip-text">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default PlantCare;
