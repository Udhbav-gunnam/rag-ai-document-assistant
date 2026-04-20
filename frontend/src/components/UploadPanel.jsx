import { useState } from "react";

export default function UploadPanel() {
  const [file, setFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Select a PDF first");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      "http://localhost:8000/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    setLoading(false);
    
    setUploadedFileName(file.name);

    alert(data.message);
  };

  return (
    <div className="bg-slate-50 border rounded-xl p-4 shadow-sm">

      <label className="block font-semibold mb-2">
        Upload Document
      </label>

      <div className="flex gap-3">

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="flex-1 border rounded-lg p-2"
        />

        <button
          onClick={handleUpload}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-lg shadow"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

      </div>
      {uploadedFileName && (
        <div className="mt-3 text-sm text-green-600">
          Active document: <strong>{uploadedFileName}</strong>
        </div>
      )}
    </div>
  );
}