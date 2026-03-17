import styles from "./ProcessingScreen.module.css";

export default function ProcessingScreen() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.scanner}>
        <div className={styles.scanBar} />
        <div className={styles.gridOverlay} />
        <div className={styles.cornerTL} />
        <div className={styles.cornerTR} />
        <div className={styles.cornerBL} />
        <div className={styles.cornerBR} />
      </div>
      <p className={styles.text}>Analyzing media...</p>
      <p className={styles.subtext}>This may take a few seconds</p>
    </div>
  );
}
