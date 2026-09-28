import { useEffect, useRef, useState } from "react";
import "./App.css";

const SUGGESTIONS = [
  { label: "What can you help me with?", prompt: "What can you help me with?" },
  { label: "Explain AI", prompt: "Explain artificial intelligence" },
  { label: "Help me write code", prompt: "Help me write some code" },
];

function replyFor(userText) {
  const text = userText.toLowerCase();

  if (text.includes("help me with") || text.includes("what can you")) {
    return "I can explain ideas, draft writing, and help you think through code. Tell me the task and the outcome you want, and I’ll start there.";
  }

  if (text.includes("artificial intelligence") || text.includes("explain ai")) {
    return "AI is software that finds patterns and generates useful output from them — text, images, decisions, or code. The practical version is a model trained on examples, then asked to produce something new for a specific prompt.";
  }

  if (text.includes("code")) {
    return "Share the language, what the code should do, and any constraints (framework, file, error). I’ll sketch a clean starting point you can paste and adapt.";
  }

  return "Got it. Give me a bit more context — goal, audience, and any constraints — and I’ll respond with a clear next step.";
}

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const threadRef = useRef(null);
  const replyTimer = useRef(null);
  const textareaRef = useRef(null);

  const hasUserMessages = messages.some((m) => m.role === "user");
  const canSend = Boolean(input.trim()) && !isTyping;

  useEffect(() => {
    const node = threadRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (replyTimer.current) clearTimeout(replyTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!sidebarOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sidebarOpen]);

  const resizeComposer = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const closeSidebar = () => setSidebarOpen(false);

  const sendText = (raw) => {
    const text = raw.trim();
    if (!text || isTyping) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setIsTyping(true);
    closeSidebar();

    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    });

    if (replyTimer.current) clearTimeout(replyTimer.current);
    replyTimer.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: replyFor(text) },
      ]);
      setIsTyping(false);
    }, 750);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    sendText(input);
  };

  const newChat = () => {
    if (replyTimer.current) clearTimeout(replyTimer.current);
    setMessages([]);
    setInput("");
    setIsTyping(false);
    closeSidebar();
  };

  const onComposerKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendText(input);
    }
  };

  return (
    <div className={`app${sidebarOpen ? " sidebar-open" : ""}`}>
      <div
        className="sidebar-backdrop"
        onClick={closeSidebar}
        aria-hidden={!sidebarOpen}
      />

      <aside className="sidebar" aria-label="Workspace">
        <div className="brand-row">
          <div className="brand-mark" aria-hidden="true">
            ✦
          </div>
          <div>
            <h1 className="brand">Brightlant AI</h1>
            <p className="brand-sub">Workspace</p>
          </div>
          <button
            className="sidebar-close"
            type="button"
            aria-label="Close menu"
            onClick={closeSidebar}
          >
            ✕
          </button>
        </div>

        <button className="new-chat" type="button" onClick={newChat}>
          <span aria-hidden="true">＋</span>
          New chat
        </button>

        <p className="side-label">Menu</p>
        <nav className="side-nav">
          <button className="side-item active" type="button">
            <span className="side-icon" aria-hidden="true">
              ▣
            </span>
            Chat
          </button>
          <button className="side-item" type="button">
            <span className="side-icon" aria-hidden="true">
              ⚙
            </span>
            Settings
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="avatar user-avatar">Y</div>
          <div className="user-meta">
            <strong>Yash</strong>
            <small>Free plan</small>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button
            className="menu-button"
            type="button"
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className="topbar-title">
            <span className="topbar-name">Chat</span>
            <span className="status">
              <i />
              AI Assistant
            </span>
          </div>
        </header>

        <section
          className={`chat-area${hasUserMessages ? " has-thread" : ""}`}
          ref={threadRef}
        >
          <div className="chat-content">
            {!hasUserMessages && (
              <div className="welcome">
                <div className="welcome-icon" aria-hidden="true">
                  ✦
                </div>
                <p className="welcome-kicker">Brightlant AI</p>
                <h2>How can I help you today?</h2>
                <p className="welcome-copy">
                  Ask a question, drop in a task, or pick a prompt to get
                  started.
                </p>
              </div>
            )}

            {hasUserMessages && (
              <div className="messages" role="log" aria-live="polite">
                {messages.map((message, index) => (
                  <div
                    className={`message-row ${message.role}`}
                    key={`${message.role}-${index}`}
                  >
                    <div
                      className={`message-avatar ${message.role === "bot" ? "bot-avatar" : "user-avatar"}`}
                      aria-hidden="true"
                    >
                      {message.role === "bot" ? "✦" : "Y"}
                    </div>
                    <div className="message-stack">
                      <span className="message-label">
                        {message.role === "bot" ? "Brightlant" : "You"}
                      </span>
                      <div className="message-bubble">{message.text}</div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="message-row bot typing-row">
                    <div className="message-avatar bot-avatar" aria-hidden="true">
                      ✦
                    </div>
                    <div className="message-stack">
                      <span className="message-label">Brightlant</span>
                      <div
                        className="message-bubble typing-bubble"
                        aria-label="Assistant is typing"
                      >
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!hasUserMessages && (
              <div className="suggestions">
                {SUGGESTIONS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => sendText(item.prompt)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <form className="input-area" onSubmit={sendMessage}>
          <div className={`input-box${canSend ? " ready" : ""}`}>
            <textarea
              ref={textareaRef}
              value={input}
              rows={1}
              onChange={(e) => {
                setInput(e.target.value);
                resizeComposer();
              }}
              onKeyDown={onComposerKeyDown}
              placeholder="Message Brightlant AI"
              aria-label="Message Brightlant AI"
              disabled={isTyping}
            />
            <button
              className="send-button"
              type="submit"
              disabled={!canSend}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M4.5 19.5 19.5 12 4.5 4.5 7.2 12z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          <p className="disclaimer">
            Brightlant AI can make mistakes. Check important information.
          </p>
        </form>
      </main>
    </div>
  );
}

export default App;
