import { useState } from "react";
import UploadSection from "./components/UploadSection";
import ProcessingScreen from "./components/ProcessingScreen";
import ResultCard from "./components/ResultCard";

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png"];

function getExtension(filename) {
  return (filename || "").split(".").pop().toLowerCase();
}

export default function App() {
  const [screen, setScreen] = useState("upload");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleAnalyze(file) {
    setError(null);
    setScreen("processing");

    const ext = getExtension(file.name);
    const endpoint = IMAGE_EXTENSIONS.includes(ext)
      ? "/analyze/image"
      : "/analyze/video";

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || `Analysis failed (${res.status})`);
      }

      const data = await res.json();
      setResult(data);
      setScreen("result");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setScreen("upload");
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
    setScreen("upload");
  }

  return (
    <>
      {error && screen === "upload" && (
        <div
          key="error"
          className="screen-enter"
          style={{
            marginBottom: "1rem",
            padding: "0.75rem 1.25rem",
            background: "rgba(255, 61, 0, 0.12)",
            border: "1px solid rgba(255, 61, 0, 0.25)",
            borderRadius: "var(--radius)",
            color: "#ff3d00",
            fontSize: "0.85rem",
            textAlign: "center",
            maxWidth: 520,
            width: "100%",
          }}
        >
          {error}
        </div>
      )}

      <div key={screen} className="screen-enter">
        {screen === "upload" && <UploadSection onAnalyze={handleAnalyze} />}
        {screen === "processing" && <ProcessingScreen />}
        {screen === "result" && (
          <ResultCard result={result} onReset={handleReset} />
        )}
      </div>
    </>
  );
}
