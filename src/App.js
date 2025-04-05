import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const API_URL = "https://b53983565c822a9d52.gradio.live/"; // Replace with your live Gradio link

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);

    const payload = {
      data: [
        input,
        newMessages
          .filter(m => m.role === "user" || m.role === "assistant")
          .map((m, idx, arr) => {
            if (m.role === "user") {
              const reply = arr[idx + 1]?.role === "assistant" ? arr[idx + 1].content : "";
              return [m.content, reply];
            }
            return null;
          })
          .filter(Boolean)
      ]
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const reply = result?.data || "No response";

      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      setInput("");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="app-wrapper">
      <header className="chat-header">
        <h2>MAN.AI</h2>
        <span>by Ai.MAN</span>
      </header>

      <div className="chat-window">
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-bubble ${msg.role === "user" ? "user-bubble" : "bot-bubble"}`}
            >
              {msg.content}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
