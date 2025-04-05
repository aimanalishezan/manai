// src/App.js
import React, { useState } from "react";
import "./App.css";

const API_URL = "https://abc123.gradio.live/api/predict"; // Replace with your Gradio live link

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: [input, messages.map(msg => [msg.content, ""])]
        })
      });

      const json = await res.json();
      const reply = json.data[0];

      setMessages((prev) => [...prev, { role: "ai", content: reply }]);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>🤖 MAN.AI</h1>
        <p>Developed by Ai.MAN</p>
      </header>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`msg ${msg.role}`}>
            <b>{msg.role === "user" ? "You" : "MAN.AI"}</b>: {msg.content}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
