import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hello! 👋 I'm Brightlant AI. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: input.trim() },
    ]);

    setInput("");
  };

  const newChat = () => {
    setMessages([
      {
        role: "bot",
        text: "Hello! 👋 I'm Brightlant AI. How can I help you today?",
      },
    ]);
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="brand">✦ Brightlant AI</h2>

        <button className="new-chat" onClick={newChat}>
          ＋ New Chat
        </button>

        <p className="side-label">MENU</p>
        <div className="side-item active">▣ Chat</div>
        <div className="side-item">⚙ Settings</div>

        <div className="sidebar-bottom">
          <div className="avatar">Y</div>
          <div>
            <strong>Yash</strong>
            <small>Free plan</small>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <span className="status">
            <i></i> AI Assistant
          </span>
        </header>

        <section className="chat-area">
          <div className="chat-content">
            <div className="welcome">
              <div className="welcome-icon">✦</div>
              <h1>How can I help you today?</h1>
              <p>Ask me anything. Let's get started!</p>
            </div>

            <div className="messages">
              {messages.map((message, index) => (
                <div
                  className={`message-row ${message.role}`}
                  key={index}
                >
                  <div className="message-avatar">
                    {message.role === "bot" ? "✦" : "Y"}
                  </div>

                  <div className="message-bubble">
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="suggestions">
              <button
                onClick={() =>
                  setInput("What can you help me with?")
                }
              >
                ✧ What can you help me with?
              </button>

              <button
                onClick={() =>
                  setInput("Explain artificial intelligence")
                }
              >
                ✧ Explain AI
              </button>

              <button
                onClick={() =>
                  setInput("Help me write some code")
                }
              >
                ✧ Help me write code
              </button>
            </div>
          </div>
        </section>

        <form className="input-area" onSubmit={sendMessage}>
          <div className="input-box">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Brightlant AI..."
              aria-label="Message"
            />

            <button
              className="send-button"
              type="submit"
              disabled={!input.trim()}
            >
              ➤
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
