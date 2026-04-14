"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <nav className={styles.navLeft}>
          <Link
            href="/posts"
            className={`${styles.navLink} ${pathname.startsWith("/posts") ? styles.active : ""}`}
          >
            Archive
          </Link>
          <Link href="/about" className={styles.navLink}>
            About
          </Link>
        </nav>

        <Link href="/" className={styles.masthead}>
          <span className={styles.mastheadMain}>Mockup Blog</span>
          <span className={styles.mastheadSub}>written in nextjs</span>
        </Link>

        <nav className={styles.navRight}>
          <Link href="/submit" className={styles.navLinkAccent}>
            Submit Work
          </Link>
        </nav>
      </div>
    </header>
  );
}