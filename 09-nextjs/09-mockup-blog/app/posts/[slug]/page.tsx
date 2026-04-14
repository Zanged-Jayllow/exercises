import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getAllSlugs, posts } from "@/lib/posts";
import styles from "./page.module.css";

interface Props {
  params: Promise<{ slug: string }>;
}

// ── SSG: pre-render all post pages at build time ──────────────────────────────
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// ── Dynamic metadata per post ─────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }],
  };
}

// ── Page component ────────────────────────────────────────────────────────────
export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  // Find adjacent posts for navigation
  const allSlugs = getAllSlugs();
  const idx = allSlugs.indexOf(slug);
  const prev = idx > 0 ? posts[idx - 1] : null;
  const next = idx < posts.length - 1 ? posts[idx + 1] : null;

  return (
    <article className={styles.article}>
      {/* Cover band */}
      <div
        className={styles.cover}
        style={{ backgroundColor: post.coverColor }}
      >
        <div className={styles.coverInner}>
          <span className={styles.coverCategory}>{post.category}</span>
          <h1 className={styles.coverTitle}>{post.title}</h1>
          <p className={styles.coverExcerpt}>{post.excerpt}</p>
          <div className={styles.coverMeta}>
            <span>{post.author}</span>
            <span className={styles.coverDot}>·</span>
            <span>{post.date}</span>
            <span className={styles.coverDot}>·</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className={styles.body}>
        <div
          className={styles.prose}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Endmark */}
      <div className={styles.endmark}>
        <span className={styles.endmarkGlyph}>■</span>
        <p className={styles.endmarkAuthor}>{post.author}</p>
        <p className={styles.endmarkDate}>{post.date}</p>
      </div>

      {/* Post navigation */}
      <nav className={styles.postNav}>
        <div className={styles.postNavInner}>
          {prev ? (
            <Link href={`/posts/${prev.slug}`} className={styles.navPrev}>
              <span className={styles.navLabel}>Previous</span>
              <span className={styles.navTitle}>{prev.title}</span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link href={`/posts/${next.slug}`} className={styles.navNext}>
              <span className={styles.navLabel}>Next</span>
              <span className={styles.navTitle}>{next.title}</span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </nav>

      {/* Back to archive */}
      <div className={styles.backRow}>
        <Link href="/posts" className={styles.backLink}>
          Back to archive
        </Link>
      </div>
    </article>
  );
}