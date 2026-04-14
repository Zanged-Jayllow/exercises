import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.ornament}>∏</div>
        <p className={styles.title}>Mockup Blog</p>
        <p className={styles.tagline}>
          NextJS is confusing.
        </p>
        <div className={styles.rule} />
        <p className={styles.copy}>
          © {new Date().getFullYear()} Mockup Blog. No rights involved.
        </p>
      </div>
    </footer>
  );
}