import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <span className={styles.ornament}>∏</span>
        <h1 className={styles.heading}>404</h1>
        <p className={styles.subheading}>Page not found</p>
        <p className={styles.body}>
          The page you are looking for does not exist. This is because the designer is lazy.
        </p>
        <Link href="/posts" className={styles.link}>
          Return to the archive
        </Link>
      </div>
    </div>
  );
}