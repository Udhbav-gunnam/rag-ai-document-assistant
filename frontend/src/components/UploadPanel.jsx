import { useState } from "react";

export default function UploadPanel() {
  const [file, setFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (selectedFile = file) => {
    if (!selectedFile) {
      alert("Select a PDF first");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch(
      "http://localhost:8000/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    setLoading(false);
    
    setUploadedFileName(selectedFile.name);

    alert(data.message);
  };

  return (
    <div className="bg-slate-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4 shadow-sm transition-colors">
      <label className="block font-semibold mb-2 dark:text-gray-200">
        Upload Document
      </label>

      <div className="flex gap-3">

        <input
          type="file"
          accept=".pdf,.docx,.pptx,.csv,.txt,.xlsx,.png,.jpg,.jpeg"
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            if (selectedFile) {
              handleUpload(selectedFile);
            }
          }}
          className="flex-1 border dark:border-gray-600 dark:bg-gray-900 dark:text-white rounded-lg p-2"
        />

        {!uploadedFileName && (
          <button
            onClick={() => handleUpload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-lg shadow"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        )}

      </div>
      {uploadedFileName && (
        <div className="mt-3 flex items-center justify-between text-sm text-green-600">

          <span>
            Active document: <strong>{uploadedFileName}</strong>
          </span>

          <button
            onClick={() => {
              setFile(null);
              setUploadedFileName("");
            }}
            className="text-red-500 hover:text-red-700"
          >
            Remove
          </button>

        </div>
      )}
    </div>
  );
}