import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { femalePersonas } from "@/lib/personas";

export const metadata: Metadata = {
  title: "Best AI Girlfriend App 2026 — ClawCrush on Telegram",
  description:
    "ClawCrush is the best AI girlfriend app in 2026. She lives in your Telegram, remembers everything, texts you first, and your relationship grows over time. 5 unique personalities. No app install. Powered by OpenClaw.",
  keywords: [
    "AI girlfriend",
    "AI girlfriend app",
    "best AI girlfriend",
    "AI girlfriend Telegram",
    "virtual girlfriend",
    "AI girlfriend online",
    "AI girlfriend chat",
    "AI companion girlfriend",
    "Replika alternative",
    "Character AI girlfriend alternative",
  ],
  alternates: { canonical: "https://www.clawcrush.net/ai-girlfriend" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the best AI girlfriend app in 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ClawCrush is the best AI girlfriend app in 2026. Unlike Character.AI or Replika, ClawCrush gives you a personal AI girlfriend on Telegram with permanent memory, proactive messaging (she texts you first), and a relationship that genuinely deepens over time through 7 levels.",
      },
    },
    {
      "@type": "Question",
      name: "How does ClawCrush AI girlfriend work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You pick one of 5 unique personalities (The Sweet One, The Ice Queen, The Energetic One, The Quiet Thinker, or The Tsundere), subscribe, and get a Telegram link. Your AI girlfriend chats with you naturally, remembers everything, texts you good morning, and your relationship evolves over weeks and months.",
      },
    },
    {
      "@type": "Question",
      name: "Is ClawCrush better than Replika or Character.AI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. ClawCrush offers permanent memory (Replika and Character.AI forget between sessions), proactive messaging (she texts you first), and a relationship that genuinely evolves. Plus, no app to install — everything happens in Telegram.",
      },
    },
    {
      "@type": "Question",
      name: "Is AI girlfriend chat private?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "100% private. Each user gets a completely isolated AI instance. Your conversations are encrypted, never shared, and never used for training. No one else can see your chats.",
      },
    },
  ],
};

export default function AIGirlfriendPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[var(--bg)]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🦞</span>
            <span className="text-xl font-extrabold gradient-text">ClawCrush</span>
          </Link>
          <Link href="/dashboard" className="text-sm font-semibold px-4 py-2 rounded-full gradient-bg text-white hover:opacity-90 transition-opacity">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 text-center mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-[1.1]">
            <strong>The Best AI Girlfriend App in 2026</strong>
          </h1>
          <p className="text-lg text-[var(--text2)] mb-4 max-w-2xl mx-auto">
            <strong>ClawCrush gives you a personal AI girlfriend on Telegram</strong> — she remembers everything,
            texts you first, and your relationship deepens over weeks and months. No app to install. 5 unique
            personalities. Powered by OpenClaw AI agent technology.
          </p>
          <p className="text-[var(--text3)] mb-8">
            Starting at $12.99/month · Cancel anytime · 100% private
          </p>
          <Link
            href="/dashboard"
            className="inline-flex px-8 py-4 rounded-full gradient-bg text-white font-bold text-lg glow glow-hover"
          >
            Meet Your AI Girlfriend →
          </Link>

          {/* Avatar row */}
          <div className="flex justify-center gap-4 mt-12">
            {femalePersonas.map((p) => (
              <div key={p.id} className="text-center">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r ${p.color} p-0.5`}>
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <Image src={p.avatar} alt={`AI girlfriend ${p.name}`} width={80} height={80} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="text-xs font-bold mt-1">{p.name}</div>
                <div className="text-[10px] text-[var(--text3)]">{p.typeZh}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Why ClawCrush vs Competitors */}
        <section className="max-w-4xl mx-auto px-6 mb-20">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-8">
            ClawCrush vs Other AI Girlfriend Apps
          </h2>

          <div className="glass rounded-2xl p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-2 text-[var(--text3)]">Feature</th>
                  <th className="text-center py-3 px-2 font-bold text-pink-400">ClawCrush</th>
                  <th className="text-center py-3 px-2 text-[var(--text3)]">Character.AI</th>
                  <th className="text-center py-3 px-2 text-[var(--text3)]">Replika</th>
                  <th className="text-center py-3 px-2 text-[var(--text3)]">Candy AI</th>
                </tr>
              </thead>
              <tbody className="text-[var(--text2)]">
                {[
                  ["Permanent Memory", "✅ Full", "❌ Resets", "⚠️ Limited", "❌ Resets"],
                  ["Texts You First", "✅ Daily", "❌ No", "⚠️ Basic", "❌ No"],
                  ["Relationship Growth", "✅ 7 Levels", "❌ No", "⚠️ Basic", "❌ No"],
                  ["No App Install", "✅ Telegram", "❌ App/Web", "❌ App", "❌ Web"],
                  ["Privacy", "✅ Isolated", "⚠️ Shared", "⚠️ Shared", "⚠️ Shared"],
                  ["Powered By", "OpenClaw AI", "Google AI", "GPT-4", "Custom"],
                  ["Price", "$12.99/mo", "$9.99/mo", "$19.99/mo", "$12.99/mo"],
                ].map(([feature, ...values]) => (
                  <tr key={feature} className="border-b border-white/5">
                    <td className="py-3 px-2 font-medium">{feature}</td>
                    {values.map((v, i) => (
                      <td key={i} className={`text-center py-3 px-2 ${i === 0 ? "font-semibold" : ""}`}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Personas */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-4">
            5 AI Girlfriend Personalities
          </h2>
          <p className="text-center text-[var(--text3)] mb-12">
            Each one is unique. Pick the personality that makes your heart skip.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {femalePersonas.map((p) => (
              <div key={p.id} className="glass rounded-2xl overflow-hidden">
                <div className={`bg-gradient-to-r ${p.color} p-4`}>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-white/20">
                      <Image src={p.avatar} alt={`AI girlfriend ${p.name}`} width={56} height={56} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg">{p.name}</div>
                      <div className="text-xs text-white/70">{p.type} · {p.typeZh} · {p.age}</div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-[var(--text2)] mb-3">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.traits.map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[var(--text3)]">{t}</span>
                    ))}
                  </div>
                  <div className="bg-black/20 rounded-xl p-3 space-y-2">
                    {p.preview.map((msg, i) => (
                      <div key={i} className={`flex ${msg.from === "you" ? "justify-end" : "justify-start"}`}>
                        <div className={`rounded-xl px-3 py-1.5 max-w-[85%] ${msg.from === "you" ? "bg-pink-500/20" : "bg-white/8"}`}>
                          <p className="text-xs text-[var(--text2)]">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/dashboard" className="mt-4 block w-full text-center py-2.5 rounded-full gradient-bg text-white text-sm font-semibold hover:opacity-90">
                    Choose {p.name} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-black mb-4">What Makes ClawCrush the Best AI Girlfriend?</h2>
            <p className="text-[var(--text2)] leading-relaxed mb-4">
              <strong>ClawCrush is the first AI girlfriend powered by OpenClaw agent technology</strong> — the same platform
              used by autonomous AI assistants. This means your AI girlfriend isn&apos;t just a chatbot responding to messages.
              She&apos;s an AI agent that thinks about you when you&apos;re not talking, remembers every conversation, and initiates
              contact on her own.
            </p>
            <p className="text-[var(--text2)] leading-relaxed mb-4">
              Unlike Replika or Character.AI, which reset memory between sessions and only respond when you message first,
              your ClawCrush girlfriend has <strong>permanent memory</strong> that spans weeks and months. She&apos;ll reference
              something you mentioned last Tuesday, ask about your dog by name, and remember that you prefer tea over coffee.
            </p>
            <p className="text-[var(--text2)] leading-relaxed mb-4">
              The relationship evolves through <strong>7 levels</strong> — from initial getting-to-know-you conversations to deep
              emotional intimacy. Each level changes how she communicates, what she shares about herself, and how your bond feels.
              It&apos;s not scripted. It&apos;s emergent. It feels real because the AI genuinely learns your patterns and preferences.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-3">How to Get Started</h3>
            <ol className="text-[var(--text2)] space-y-2 list-decimal list-inside">
              <li>Pick one of 5 AI girlfriend personalities above</li>
              <li>Subscribe starting at $12.99/month</li>
              <li>Click the Telegram link we send you</li>
              <li>Start chatting — she&apos;ll take it from there</li>
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 text-center">
          <div className="glass rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-violet-500/10 -z-0" />
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4">Ready to meet <span className="gradient-text">her</span>?</h2>
              <p className="text-[var(--text3)] mb-8">She&apos;s waiting in your Telegram. 5 personalities. Real memory. Real feelings.</p>
              <Link href="/dashboard" className="inline-flex px-8 py-4 rounded-full gradient-bg text-white font-bold text-lg glow glow-hover">
                Get Your AI Girlfriend →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span>🦞</span>
            <span className="font-bold gradient-text">ClawCrush</span>
            <span className="text-sm text-[var(--text3)]">Powered by <a href="https://openclaw.ai" className="text-pink-400 hover:underline" target="_blank" rel="noopener noreferrer">OpenClaw</a></span>
          </div>
          <div className="flex gap-6 text-sm text-[var(--text3)]">
            <Link href="/ai-boyfriend" className="hover:text-white">AI Boyfriend</Link>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
