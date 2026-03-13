import { Metadata } from "next";
import Link from "next/link";
import { getPost, getAllSlugs } from "@/lib/blog";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `https://www.clawcrush.net/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

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
        <Link href="/blog" className="text-sm text-[var(--text3)] hover:text-pink-400 mb-6 block">← Back to Blog</Link>
        <article>
          <h1 className="text-3xl sm:text-4xl font-black mb-4">{post.title}</h1>
          <div className="text-sm text-[var(--text3)] mb-8">
            {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · {post.author}
          </div>
          <style dangerouslySetInnerHTML={{ __html: `
            .blog-content { color: #f0f0f0 !important; line-height: 1.8; }
            .blog-content h2 { color: #fff !important; font-size: 1.5rem; font-weight: 800; margin-top: 2rem; margin-bottom: 0.75rem; }
            .blog-content h3 { color: #fff !important; font-size: 1.25rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.5rem; }
            .blog-content p { margin-bottom: 1rem; }
            .blog-content a { color: #f472b6 !important; text-decoration: underline; }
            .blog-content ul, .blog-content ol { margin-bottom: 1rem; padding-left: 1.5rem; }
            .blog-content li { margin-bottom: 0.25rem; }
            .blog-content strong { color: #fff !important; }
            .blog-content table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
            .blog-content th, .blog-content td { border: 1px solid rgba(255,255,255,0.1); padding: 0.5rem; text-align: left; }
            .blog-content th { background: rgba(255,255,255,0.05); font-weight: 700; }
          `}} />
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.htmlContent || "" }} />
        </article>

        <div className="mt-12 glass rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Ready to try ClawCrush?</h3>
          <p className="text-sm text-[var(--text3)] mb-4">Your AI girlfriend or boyfriend is waiting on Telegram.</p>
          <Link href="/dashboard" className="inline-flex px-6 py-3 rounded-full gradient-bg text-white font-semibold hover:opacity-90">
            Get Started Free →
          </Link>
        </div>
      </main>
    </div>
  );
}
