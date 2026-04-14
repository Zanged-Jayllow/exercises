import type { Metadata } from "next";
import { posts } from "@/lib/posts";
import PostsFilter from "./PostsFilter";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Mock Archive",
  description: "All articles from The Long Read.",
};

// Page shell stays a Server Component (SSG) — only the filter is a Client Component
export const dynamic = "force-static";

const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

export default function PostsPage() {
  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.header}>
        <h1 className={styles.heading}>Mock Archive</h1>
        <p className={styles.subheading}>
          {posts.length} pieces &nbsp;·&nbsp; Vol. Whatever
        </p>
      </div>

      {/* Client component handles filtering + rendering the list */}
      <PostsFilter posts={posts} categories={categories} />
    </div>
  );
}