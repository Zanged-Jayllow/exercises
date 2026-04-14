import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/lib/posts";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Archive",
  description: "All articles from The Long Read.",
};

// This page is statically generated at build time
export const dynamic = "force-static";

const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

export default function PostsPage() {
  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.header}>
        <h1 className={styles.heading}>The Archive</h1>
        <p className={styles.subheading}>
          {posts.length} pieces &nbsp;·&nbsp; Vol. I
        </p>
      </div>

      {/* Category filter (visual only — full filtering would need client component) */}
      <div className={styles.filterRow}>
        {categories.map((cat, i) => (
          <span key={cat} className={`${styles.filter} ${i === 0 ? styles.filterActive : ""}`}>
            {cat}
          </span>
        ))}
      </div>

      {/* Article list */}
      <div className={styles.list}>
        {posts.map((post, i) => (
          <article key={post.slug} className={styles.card}>
            {/* Color swatch */}
            <div
              className={styles.swatch}
              style={{ backgroundColor: post.coverColor }}
            >
              <span className={styles.swatchNum}>0{i + 1}</span>
            </div>

            {/* Content */}
            <div className={styles.content}>
              <div className={styles.meta}>
                <span className={styles.category}>{post.category}</span>
                <span className={styles.dot}>·</span>
                <span className={styles.date}>{post.date}</span>
              </div>
              <h2 className={styles.title}>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className={styles.excerpt}>{post.excerpt}</p>
              <div className={styles.footer}>
                <span className={styles.author}>By {post.author}</span>
                <Link href={`/posts/${post.slug}`} className={styles.readLink}>
                  {post.readTime} →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}