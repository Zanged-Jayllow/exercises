import styles from "./loading.module.css";

export default function PostsLoading() {
  return (
    <div className={styles.page} aria-label="Loading archive…">
      {/* Header skeleton */}
      <div className={styles.header}>
        <div className={`${styles.shimmer} ${styles.headingLine}`} />
        <div className={`${styles.shimmer} ${styles.subLine}`} />
      </div>

      {/* Filter row skeleton */}
      <div className={styles.filterRow}>
        {[90, 70, 80, 65, 75].map((w, i) => (
          <div
            key={i}
            className={`${styles.shimmer} ${styles.filterChip}`}
            style={{ width: w }}
          />
        ))}
      </div>

      {/* Card skeletons */}
      <div className={styles.list}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.card}>
            <div className={`${styles.swatch} ${styles.shimmerDark}`} />
            <div className={styles.content}>
              <div className={styles.metaRow}>
                <div className={`${styles.shimmer} ${styles.categoryChip}`} />
                <div className={`${styles.shimmer} ${styles.dateChip}`} />
              </div>
              <div className={`${styles.shimmer} ${styles.titleLine}`} />
              <div className={`${styles.shimmer} ${styles.titleLineShort}`} />
              <div className={`${styles.shimmer} ${styles.excerptLine}`} />
              <div className={`${styles.shimmer} ${styles.excerptLineMed}`} />
              <div className={styles.footer}>
                <div className={`${styles.shimmer} ${styles.authorChip}`} />
                <div className={`${styles.shimmer} ${styles.readChip}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}