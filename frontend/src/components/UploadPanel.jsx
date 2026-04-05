import React, { useState } from "react";

export default function UploadPanel() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      alert(data.message);

      console.log("Upload success:", data);

    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  return (
    <div>
      <h2>Upload PDF</h2>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
}