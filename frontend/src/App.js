import { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const askQuestion = async () => {
    if (!question) return;

    const newMessages = [...messages, { role: "user", text: question }];
    setMessages(newMessages);

    const res = await fetch(`http://127.0.0.1:8000/ask?q=${question}`);
    const data = await res.json();

    setMessages([
      ...newMessages,
      { role: "bot", text: data.answer }
    ]);

    setQuestion("");
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#111", color: "white" }}>
      
      <h2 style={{ padding: "10px" }}>AI PDF Chatbot 🤖</h2>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            margin: "10px 0",
            padding: "10px",
            borderRadius: "10px",
            background: msg.role === "user" ? "#2563eb" : "#333",
            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
            maxWidth: "60%"
          }}>
            {msg.text}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", padding: "10px" }}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{ flex: 1, padding: "10px" }}
          placeholder="Ask something..."
        />
        <button onClick={askQuestion} style={{ marginLeft: "10px" }}>
          Send
        </button>
      </div>

    </div>
  );
}

export default App;