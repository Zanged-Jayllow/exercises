import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.ornament}>❦</div>
        <p className={styles.title}>The Long Read</p>
        <p className={styles.tagline}>
          Good writing takes time. So does reading it.
        </p>
        <div className={styles.rule} />
        <p className={styles.copy}>
          © {new Date().getFullYear()} The Long Read. All rights reserved.
        </p>
      </div>
    </footer>
  );
}