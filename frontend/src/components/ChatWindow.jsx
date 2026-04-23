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
      <div className="flex-1 overflow-y-auto border dark:border-gray-700 rounded-xl p-4 bg-slate-50 dark:bg-gray-800 transition-colors">
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
                  : "bg-white dark:bg-gray-700 border dark:border-gray-600 dark:text-gray-200"
              }`}
            >
              {msg.text}
            </div>

          </div>

        ))}

        {loading && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 animate-pulse">

            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>

            Assistant is thinking...

          </div>
        )}

      </div>

      {/* Input area */}
      <div className="flex gap-2 mt-4">

        <textarea
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);

            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              askQuestion();
            }
          }}
          placeholder="Ask something about your document..."
          rows={1}
          className="flex-1 border dark:border-gray-600 dark:bg-gray-900 dark:text-white rounded-lg p-3 shadow-sm resize-none overflow-hidden"
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