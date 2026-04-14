import styles from "./loading.module.css";

export default function PostLoading() {
  return (
    <div className={styles.wrapper} aria-label="Loading article…">
      {/* Cover skeleton */}
      <div className={styles.cover}>
        <div className={styles.coverInner}>
          <div className={`${styles.shimmer} ${styles.category}`} />
          <div className={`${styles.shimmer} ${styles.titleLine1}`} />
          <div className={`${styles.shimmer} ${styles.titleLine2}`} />
          <div className={`${styles.shimmer} ${styles.excerpt}`} />
          <div className={`${styles.shimmer} ${styles.excerptShort}`} />
          <div className={styles.metaRow}>
            <div className={`${styles.shimmer} ${styles.metaChip}`} />
            <div className={`${styles.shimmer} ${styles.metaChip}`} />
            <div className={`${styles.shimmer} ${styles.metaChip}`} />
          </div>
        </div>
      </div>

      {/* Body skeleton */}
      <div className={styles.body}>
        {/* Paragraph 1 */}
        <div className={`${styles.shimmer} ${styles.paraFull}`} />
        <div className={`${styles.shimmer} ${styles.paraFull}`} />
        <div className={`${styles.shimmer} ${styles.paraFull}`} />
        <div className={`${styles.shimmer} ${styles.paraMed}`} />

        <div className={styles.gap} />

        {/* Pull quote */}
        <div className={styles.pullQuote}>
          <div className={`${styles.shimmer} ${styles.pullLine}`} />
          <div className={`${styles.shimmer} ${styles.pullLineShort}`} />
        </div>

        <div className={styles.gap} />

        {/* Paragraph 2 */}
        <div className={`${styles.shimmer} ${styles.paraFull}`} />
        <div className={`${styles.shimmer} ${styles.paraFull}`} />
        <div className={`${styles.shimmer} ${styles.paraFull}`} />
        <div className={`${styles.shimmer} ${styles.paraShort}`} />

        <div className={styles.gap} />

        {/* Paragraph 3 */}
        <div className={`${styles.shimmer} ${styles.paraFull}`} />
        <div className={`${styles.shimmer} ${styles.paraMed}`} />
        <div className={`${styles.shimmer} ${styles.paraFull}`} />
        <div className={`${styles.shimmer} ${styles.paraShort}`} />
      </div>
    </div>
  );
}