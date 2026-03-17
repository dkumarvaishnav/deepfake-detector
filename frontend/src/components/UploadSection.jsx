import { useState, useRef } from "react";
import styles from "./UploadSection.module.css";

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "mp4", "mov"];
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png"];

function getExtension(filename) {
  return (filename || "").split(".").pop().toLowerCase();
}

export default function UploadSection({ onAnalyze }) {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  function validateAndSet(f) {
    setError(null);
    const ext = getExtension(f.name);
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError(`Unsupported file type ".${ext}". Please upload JPG, PNG, MP4, or MOV.`);
      setFile(null);
      return;
    }
    setFile(f);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      validateAndSet(e.dataTransfer.files[0]);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function handleClick() {
    inputRef.current?.click();
  }

  function handleChange(e) {
    if (e.target.files.length > 0) {
      validateAndSet(e.target.files[0]);
    }
  }

  function handleAnalyze() {
    if (file) onAnalyze(file);
  }

  const ext = file ? getExtension(file.name) : null;
  const isImage = ext && IMAGE_EXTENSIONS.includes(ext);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Deepfake Detector</h2>
      <p className={styles.subtitle}>Upload media to analyze for AI manipulation</p>

      <div
        className={`${styles.dropzone} ${dragOver ? styles.dropzoneDragOver : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <div className={styles.dropzoneIcon}>&#9906;</div>
        <p className={styles.dropzoneText}>
          Drag & drop your file here, or{" "}
          <span className={styles.dropzoneTextAccent}>browse</span>
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.mp4,.mov"
          onChange={handleChange}
          className={styles.hiddenInput}
        />
      </div>

      {file && (
        <div className={styles.fileInfo}>
          <span className={styles.fileName}>{file.name}</span>
          <span
            className={`${styles.badge} ${isImage ? styles.badgeImage : styles.badgeVideo}`}
          >
            {isImage ? "IMAGE" : "VIDEO"}
          </span>
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      <button
        className={styles.analyzeBtn}
        disabled={!file}
        onClick={handleAnalyze}
      >
        Analyze Media
      </button>

      <p className={styles.hint}>Supported formats: JPG, PNG, MP4, MOV</p>
    </div>
  );
}
