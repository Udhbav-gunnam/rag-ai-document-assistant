import UploadPanel from "../components/UploadPanel";
import ChatWindow from "../components/ChatWindow";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">

      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">
          AI Document Assistant
        </h1>

        <span className="text-gray-500 text-sm">
          Chat with your PDFs instantly
        </span>
      </header>

      {/* Main container */}
      <main className="flex justify-center mt-8">
        <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-6">

          <UploadPanel />

          <div className="mt-6">
            <ChatWindow />
          </div>

        </div>
      </main>

    </div>
  );
}