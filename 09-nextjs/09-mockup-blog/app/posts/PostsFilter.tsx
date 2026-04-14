"use client";

import { useState } from "react";
import Link from "next/link";
import { Post } from "@/lib/posts";
import styles from "./page.module.css";

interface Props {
  posts: Post[];
  categories: string[];
}

export default function PostsFilter({ posts, categories }: Props) {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? posts : posts.filter((p) => p.category === active);

  return (
    <>
      {/* Category filter */}
      <div className={styles.filterRow}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`${styles.filter} ${active === cat ? styles.filterActive : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Result count */}
      <p className={styles.resultCount}>
        {filtered.length === posts.length
          ? `All ${posts.length} pieces`
          : `${filtered.length} piece${filtered.length !== 1 ? "s" : ""} in ${active}`}
      </p>

      {/* Article list */}
      <div className={styles.list}>
        {filtered.map((post, i) => {
          // Keep the original index for the number label
          const originalIndex = posts.indexOf(post);
          return (
            <article key={post.slug} className={styles.card}>
              <div
                className={styles.swatch}
                style={{ backgroundColor: post.coverColor }}
              >
                <span className={styles.swatchNum}>
                  {String(originalIndex + 1).padStart(2, "0")}
                </span>
              </div>

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
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyGlyph}>❧</span>
          <p>No pieces found in this category.</p>
        </div>
      )}
    </>
  );
}