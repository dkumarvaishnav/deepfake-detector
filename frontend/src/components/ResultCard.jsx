import styles from "./ResultCard.module.css";

export default function ResultCard({ result, onReset }) {
  const isReal = result.label === "Real";
  const pct = Math.round(result.confidence * 100);

  return (
    <div className={styles.wrapper}>
      <div className={styles.icon}>{isReal ? "\u2705" : "\uD83D\uDEA8"}</div>
      <h2
        className={`${styles.verdict} ${isReal ? styles.verdictReal : styles.verdictFake}`}
      >
        {isReal ? "Authentic" : "Deepfake Detected"}
      </h2>

      <div className={styles.confidenceSection}>
        <p className={styles.confidenceLabel}>Confidence Score</p>
        <p
          className={`${styles.confidenceValue} ${isReal ? styles.confidenceValueReal : styles.confidenceValueFake}`}
        >
          {pct}%
        </p>
        <div className={styles.barTrack}>
          <div
            className={`${styles.barFill} ${isReal ? styles.barFillReal : styles.barFillFake}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {result.frames_analyzed != null && (
          <p className={styles.framesInfo}>
            {result.frames_analyzed} frames analyzed
          </p>
        )}
      </div>

      <p className={styles.disclaimer}>
        This result is AI-generated and may not be 100% accurate.
      </p>

      <button className={styles.resetBtn} onClick={onReset}>
        Analyze Another File
      </button>
    </div>
  );
}
