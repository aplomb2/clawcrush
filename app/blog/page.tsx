import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — AI Girlfriend & Boyfriend Guides | ClawCrush",
  description: "Tips, guides, and comparisons for AI companions — AI girlfriend apps, AI boyfriend apps, privacy, and more.",
  alternates: { canonical: "https://www.clawcrush.net/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[var(--bg)]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🦞</span>
            <span className="text-xl font-extrabold gradient-text">ClawCrush</span>
          </Link>
          <Link href="/dashboard" className="text-sm font-semibold px-4 py-2 rounded-full gradient-bg text-white hover:opacity-90">Get Started</Link>
        </div>
      </nav>

      <main className="pt-24 pb-20 max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-black mb-8">Blog</h1>
        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block glass rounded-xl p-6 hover:border-pink-500/30 transition-all">
              <h2 className="text-lg font-bold mb-2 hover:text-pink-400 transition-colors">{post.title}</h2>
              <p className="text-sm text-[var(--text3)] mb-2">{post.description}</p>
              <div className="text-xs text-[var(--text3)]">{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · {post.author}</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
