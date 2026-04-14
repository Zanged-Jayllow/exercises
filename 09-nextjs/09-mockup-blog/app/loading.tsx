import styles from "./loading.module.css";

export default function HomeLoading() {
  return (
    <div className={styles.page} aria-label="Loading…">
      {/* Hero skeleton */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCover} />
          <div className={styles.heroContent}>
            <div className={`${styles.shimmer} ${styles.eyebrow}`} />
            <div className={`${styles.shimmer} ${styles.heroTitle1}`} />
            <div className={`${styles.shimmer} ${styles.heroTitle2}`} />
            <div className={`${styles.shimmer} ${styles.heroExcerpt}`} />
            <div className={`${styles.shimmer} ${styles.heroExcerptShort}`} />
            <div className={styles.metaRow}>
              {[80, 70, 90].map((w, i) => (
                <div key={i} className={`${styles.shimmer} ${styles.metaChip}`} style={{ width: w }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary grid skeleton */}
      <div className={styles.secondary}>
        {[0, 1].map((i) => (
          <div key={i} className={styles.secCard}>
            <div className={styles.secCover} />
            <div className={styles.secBody}>
              <div className={`${styles.shimmer} ${styles.secTitle}`} />
              <div className={`${styles.shimmer} ${styles.secTitleShort}`} />
              <div className={`${styles.shimmer} ${styles.secExcerpt}`} />
              <div className={`${styles.shimmer} ${styles.secExcerptShort}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}