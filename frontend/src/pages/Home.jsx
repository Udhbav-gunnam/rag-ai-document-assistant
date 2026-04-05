import UploadPanel from "../components/UploadPanel";
import ChatWindow from "../components/ChatWindow";

export default function Home() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>AI Document Assistant</h1>

      <UploadPanel />

      <hr style={{ margin: "30px 0" }} />

      <ChatWindow />
    </div>
  );
}