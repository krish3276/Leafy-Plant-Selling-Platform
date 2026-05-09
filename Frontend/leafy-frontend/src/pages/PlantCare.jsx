import React, { useState, useRef, useEffect } from 'react';
import { Send, Leaf, RotateCcw, Bot, User } from 'lucide-react';
import '../styles/PlantCare.css';

const API_BASE_URL = 'http://localhost:5000/api';

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi there! I'm Leafy, your personal plant care assistant! I can help you with watering schedules, sunlight needs, soil tips, pest problems, and anything else your green friends might need. What plant question can I help you with today?",
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
  const [isStreaming, setIsStreaming] = useState(false);
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  // Scroll only the chat box, not the whole page
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    const userText = input.trim();
    if (!userText || isStreaming) return;

    const history = messages
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({ role: m.role, content: m.content }));

    const userMessage = { id: Date.now(), role: 'user', content: userText };
    const botMessage = { id: Date.now() + 1, role: 'assistant', content: '' };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput('');
    setIsStreaming(true);

    const apiMessages = [...history, { role: 'user', content: userText }];

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
              disabled={!input.trim() || isStreaming}
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
