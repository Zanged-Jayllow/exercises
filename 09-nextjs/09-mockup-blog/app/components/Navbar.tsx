"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Left nav links */}
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

        {/* Masthead */}
        <Link href="/" className={styles.masthead}>
          <span className={styles.mastheadMain}>The Long Read</span>
          <span className={styles.mastheadSub}>est. mmxxvi</span>
        </Link>

        {/* Right nav links */}
        <nav className={styles.navRight}>
          <Link href="/subscribe" className={styles.navLink}>
            Subscribe
          </Link>
          <Link href="/submit" className={styles.navLinkAccent}>
            Submit Work
          </Link>
        </nav>
      </div>

      {/* Issue line */}
      <div className={styles.issueLine}>
        <span>Vol. I, No. 4 &nbsp;·&nbsp; Spring 2026</span>
        <span className={styles.issueLineCenter}>❧</span>
        <span>Six new pieces this issue</span>
      </div>
    </header>
  );
}