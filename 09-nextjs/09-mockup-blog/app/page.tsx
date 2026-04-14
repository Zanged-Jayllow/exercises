import Link from "next/link";
import { posts } from "@/lib/posts";
import styles from "./page.module.css";

export default function HomePage() {
  const featured = posts[0];
  const secondary = posts.slice(1, 3);
  const rest = posts.slice(3);

  return (
    <div className={styles.page}>
      {/* Hero — Featured Article */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div
            className={styles.heroCover}
            style={{ backgroundColor: featured.coverColor }}
          >
            <span className={styles.heroCategory}>{featured.category}</span>
            <div className={styles.heroGrain} />
          </div>
          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}>Featured this issue</p>
            <h1 className={styles.heroTitle}>
              <Link href={`/posts/${featured.slug}`}>{featured.title}</Link>
            </h1>
            <p className={styles.heroExcerpt}>{featured.excerpt}</p>
            <div className={styles.heroMeta}>
              <span>{featured.author}</span>
              <span className={styles.dot}>·</span>
              <span>{featured.readTime}</span>
              <span className={styles.dot}>·</span>
              <span>{featured.date}</span>
            </div>
            <Link href={`/posts/${featured.slug}`} className={styles.heroLink}>
              Read the piece →
            </Link>
          </div>
        </div>
      </section>

      {/* Secondary grid */}
      <section className={styles.secondary}>
        <div className={styles.secondaryInner}>
          {secondary.map((post) => (
            <article key={post.slug} className={styles.secondaryCard}>
              <div
                className={styles.secondaryColor}
                style={{ backgroundColor: post.coverColor }}
              >
                <span className={styles.secondaryCategory}>{post.category}</span>
              </div>
              <div className={styles.secondaryBody}>
                <h2 className={styles.secondaryTitle}>
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className={styles.secondaryExcerpt}>{post.excerpt}</p>
                <div className={styles.secondaryMeta}>
                  <span>{post.author}</span>
                  <span className={styles.dot}>·</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className={styles.divider}>
        <span>More from this issue</span>
      </div>

      {/* Compact list */}
      <section className={styles.list}>
        <div className={styles.listInner}>
          {rest.map((post, i) => (
            <article key={post.slug} className={styles.listItem}>
              <span className={styles.listNum}>0{i + 4}</span>
              <div className={styles.listBody}>
                <span className={styles.listCategory}>{post.category}</span>
                <h3 className={styles.listTitle}>
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className={styles.listExcerpt}>{post.excerpt}</p>
              </div>
              <div className={styles.listMeta}>
                <span>{post.author}</span>
                <span>{post.readTime}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className={styles.cta}>
        <Link href="/posts" className={styles.ctaLink}>
          Browse the full archive →
        </Link>
      </div>
    </div>
  );
}