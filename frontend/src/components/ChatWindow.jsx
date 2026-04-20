import { useState } from "react";

export default function ChatWindow() {

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {

    if (!question.trim()) return;

    const userMessage = {
      role: "user",
      text: question
    };

    setMessages(prev => [...prev, userMessage]);

    setLoading(true);

    const response = await fetch(
      `http://localhost:8000/chat?question=${question}`
    );

    const data = await response.json();

    const botMessage = {
      role: "assistant",
      text: data.answer
    };

    setMessages(prev => [...prev, botMessage]);

    setQuestion("");

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[400px]">

      {/* Chat history */}
      <div className="flex-1 overflow-y-auto border rounded-xl p-4 bg-slate-50">

        {messages.length === 0 && (
          <div className="text-gray-400 text-center mt-10">
            Ask something about your uploaded document
          </div>
        )}

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`flex mb-3 ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            <div
              className={`px-4 py-2 rounded-2xl max-w-md shadow ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-white border"
              }`}
            >
              {msg.text}
            </div>

          </div>

        ))}

        {loading && (
          <div className="text-gray-500 animate-pulse">
            Assistant is thinking...
          </div>
        )}

      </div>

      {/* Input area */}
      <div className="flex gap-2 mt-4">

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (!e.shiftKey) {
                e.preventDefault();
                askQuestion();
              }
            }
          }}
          placeholder="Ask something about your document..."
          rows={2}
          className="flex-1 border rounded-lg p-3 shadow-sm resize-none"
        />

        <button
          onClick={askQuestion}
          className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-lg shadow"
        >
          Ask
        </button>

      </div>

    </div>
  );
}