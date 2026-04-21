import { useState } from "react";
import UploadPanel from "../components/UploadPanel";
import ChatWindow from "../components/ChatWindow";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-md py-4 px-6 flex justify-between items-center">

        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          AI Document Assistant
        </h1>

        <button
          onClick={() => {
            setDarkMode(!darkMode);
            document.documentElement.classList.toggle("dark");
          }}
          className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

      </header>

      {/* Main container */}
      <main className="flex justify-center mt-8">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 transition-colors duration-300">
          <UploadPanel />

          <div className="mt-6">
            <ChatWindow />
          </div>

        </div>
      </main>

    </div>
  );
}