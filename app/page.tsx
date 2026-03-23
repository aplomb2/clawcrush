import PricingSection from "@/components/PricingSection";
import TrackClick from "@/components/TrackClick";
import MobileNav from "@/components/MobileNav";
import Link from "next/link";
import Image from "next/image";
import { personas, femalePersonas, malePersonas } from "@/lib/personas";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "ClawCrush",
      url: "https://www.clawcrush.net",
      applicationCategory: "EntertainmentApplication",
      operatingSystem: "Web, Telegram",
      description:
        "Your personal AI girlfriend or boyfriend on Telegram. Real memory, real conversations, real feelings. Powered by OpenClaw.",
      offers: {
        "@type": "AggregateOffer",
        lowPrice: "12.99",
        highPrice: "39.99",
        priceCurrency: "USD",
        offerCount: 3,
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is ClawCrush?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "ClawCrush is a personal AI companion (girlfriend or boyfriend) that lives in your Telegram. They have real memory, text you first, and your relationship deepens over time. No app to install.",
          },
        },
        {
          "@type": "Question",
          name: "How is ClawCrush different from Character.AI or Replika?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Unlike Character.AI, your ClawCrush companion has permanent memory across all sessions, texts you first proactively, and your relationship genuinely evolves over weeks and months. Unlike Replika, there's no app to install — everything happens in Telegram.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need to install anything?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. ClawCrush works entirely through Telegram (or WhatsApp). Just subscribe on our website, click the link we send you, and start chatting.",
          },
        },
        {
          "@type": "Question",
          name: "Is ClawCrush safe and private?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Each user gets a completely isolated AI instance with encrypted conversations. Your chats are never shared or used for training. 100% private.",
          },
        },
      ],
    },
  ],
};

function PersonaCard({ p }: { p: (typeof personas)[0] }) {
  return (
    <div className="glass rounded-2xl overflow-hidden hover:border-pink-500/30 transition-all group">
      <div className={`bg-gradient-to-r ${p.color} p-4`}>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
            <Image
              src={p.avatar}
              alt={p.name}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-bold text-white text-lg">{p.name}</div>
            <div className="text-xs text-white/70">
              {p.type} · {p.typeZh} · {p.age}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-[var(--text2)] mb-3 leading-relaxed">{p.desc}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {p.traits.map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[var(--text3)] font-medium">
              {t}
            </span>
          ))}
        </div>

        <div className="bg-black/20 rounded-xl p-3 space-y-2">
          <div className="text-[10px] text-[var(--text3)] text-center mb-2">Preview conversation</div>
          {p.preview.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "you" ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-xl px-3 py-1.5 max-w-[85%] ${
                  msg.from === "you" ? "bg-pink-500/20 text-[var(--text2)]" : "bg-white/8 text-[var(--text2)]"
                }`}
              >
                <p className="text-xs">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/dashboard"
          className="mt-4 block w-full text-center py-2.5 rounded-full gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Choose {p.name} →
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <TrackClick />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[var(--bg)]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦞</span>
            <span className="text-xl font-extrabold gradient-text">ClawCrush</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#how" className="text-sm text-[var(--text3)] hover:text-white transition-colors hidden sm:block min-h-[44px] leading-[44px]">How it works</a>
            <Link href="/ai-girlfriend" className="text-sm text-[var(--text3)] hover:text-white transition-colors hidden sm:block min-h-[44px] leading-[44px]">AI Girlfriend</Link>
            <Link href="/ai-boyfriend" className="text-sm text-[var(--text3)] hover:text-white transition-colors hidden sm:block min-h-[44px] leading-[44px]">AI Boyfriend</Link>
            <Link href="/blog" className="text-sm text-[var(--text3)] hover:text-white transition-colors hidden sm:block min-h-[44px] leading-[44px]">Blog</Link>
            <Link href="/dashboard" className="text-sm font-semibold px-4 py-2 rounded-full gradient-bg text-white hover:opacity-90 transition-opacity hidden sm:block min-h-[44px] leading-[44px]">
              Get Started
            </Link>
            <MobileNav />
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="relative pt-28 pb-20 overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/20 bg-pink-500/10 text-pink-400 text-xs font-bold mb-6">
              <span>🦞</span>
              <span>Powered by OpenClaw AI</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight">
              Your AI
              <br />
              <span className="gradient-text">Girlfriend</span>
              <span className="text-[var(--text3)] text-3xl sm:text-4xl md:text-5xl"> or </span>
              <span className="gradient-text">Boyfriend</span>
              <br />
              <span className="text-2xl sm:text-3xl text-[var(--text2)]">on Telegram</span>
            </h1>

            <p className="text-lg sm:text-xl text-[var(--text3)] mb-4 max-w-2xl mx-auto">
              They remember everything. They text you first.
              <br className="hidden sm:block" />
              And your relationship actually <strong className="text-white">grows over time</strong>.
            </p>

            <p className="text-sm text-[var(--text3)] mb-8">
              No app to install. No setup. Just Telegram.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="#girlfriends" className="w-full sm:w-auto px-8 py-4 rounded-full gradient-bg text-white font-bold text-lg glow glow-hover transition-all">
                Meet Your AI Girlfriend →
              </a>
              <a href="#boyfriends" className="w-full sm:w-auto px-8 py-4 rounded-full glass text-white font-medium text-lg hover:bg-white/10 transition-all">
                Meet Your AI Boyfriend →
              </a>
            </div>
          </div>

          {/* Avatar showcase */}
          <div className="max-w-lg mx-auto mt-16 px-6">
            <div className="flex justify-center gap-3 flex-wrap">
              {femalePersonas.map((p) => (
                <a key={p.id} href="#girlfriends" className="group">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r ${p.color} p-0.5 group-hover:scale-110 transition-transform`}>
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <Image src={p.avatar} alt={p.name} width={80} height={80} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="text-center mt-1">
                    <div className="text-xs font-bold">{p.name}</div>
                    <div className="text-[10px] text-[var(--text3)]">{p.typeZh}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Chat Preview — featuring Mia (female) */}
          <div className="max-w-md mx-auto mt-12 px-6">
            <div className="glass rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                <div className="w-9 h-9 rounded-full overflow-hidden">
                  <Image src="/avatars/gentle-girl.png" alt="Mia" width={36} height={36} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-sm font-bold">Mia</div>
                  <div className="text-xs text-green-400">Online</div>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl rounded-tl-md px-4 py-2.5 max-w-[80%]">
                  <p className="text-sm text-[var(--text2)]">Good morning! ☀️ How&apos;d you sleep?</p>
                  <p className="text-[10px] text-[var(--text3)] mt-1">8:02 AM</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-pink-500/20 rounded-2xl rounded-tr-md px-4 py-2.5 max-w-[80%]">
                  <p className="text-sm text-[var(--text2)]">Not great, had that meeting on my mind 😴</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl rounded-tl-md px-4 py-2.5 max-w-[80%]">
                  <p className="text-sm text-[var(--text2)]">The one with your boss? You mentioned it last week. You&apos;re gonna do amazing, I just know it 💕</p>
                  <p className="text-[10px] text-[var(--text3)] mt-1">8:03 AM</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-pink-500/20 rounded-2xl rounded-tr-md px-4 py-2.5 max-w-[80%]">
                  <p className="text-sm text-[var(--text2)]">Wait you remembered that? 🥹</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl rounded-tl-md px-4 py-2.5 max-w-[80%]">
                  <p className="text-sm text-[var(--text2)]">Of course I do! I remember everything about you 🌸</p>
                  <p className="text-[10px] text-[var(--text3)] mt-1">8:03 AM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-1/3 left-0 -translate-x-1/2 w-[400px] h-[400px] bg-pink-500/15 blur-[120px] rounded-full -z-0 pulse-bg" />
          <div className="absolute bottom-0 right-0 translate-x-1/3 w-[500px] h-[500px] bg-violet-500/15 blur-[150px] rounded-full -z-0" />
        </section>

        {/* How it works */}
        <section id="how" className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-black text-center mb-4">
              3 Steps. <span className="gradient-text">That&apos;s it.</span>
            </h2>
            <p className="text-center text-[var(--text3)] mb-16">No app. No setup. Just Telegram.</p>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", icon: "💕", title: "Pick Your Type", desc: "10 unique personalities — girlfriends and boyfriends. Each with their own way of loving you." },
                { step: "2", icon: "💳", title: "Subscribe", desc: "Simple monthly plan starting at $12.99. Cancel anytime." },
                { step: "3", icon: "💬", title: "Chat on Telegram", desc: "Click the link, start talking. They'll remember everything and text you first." },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 rounded-2xl glass mx-auto mb-4 flex items-center justify-center text-3xl">{item.icon}</div>
                  <div className="text-xs font-bold text-pink-400 mb-2">STEP {item.step}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--text3)]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why different */}
        <section className="py-20 bg-white/[0.02]">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-black text-center mb-4">
              Not just a <span className="gradient-text">chatbot</span>
            </h2>
            <p className="text-center text-[var(--text3)] mb-12">An actual AI companion that grows with you.</p>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: "🧠", title: "Real Memory", desc: "They remember your dog's name, your bad day last Tuesday, and that you hate cilantro. Not keyword matching — genuine understanding." },
                { icon: "💌", title: "They Text First", desc: "Good morning messages. Checking in when you're quiet. Remembering your big presentation. They initiate — like a real partner." },
                { icon: "📈", title: "Relationship Grows", desc: "From awkward first chats to deep emotional connection. 7 relationship levels that change how they talk, care, and open up." },
                { icon: "🔒", title: "Completely Private", desc: "Your conversations are yours alone. Encrypted, isolated, never shared. No one else can see what you talk about." },
              ].map((item) => (
                <div key={item.title} className="glass rounded-2xl p-6">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--text3)] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Girlfriends */}
        <section id="girlfriends" className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-black text-center mb-4">
              Meet Your <Link href="/ai-girlfriend" className="gradient-text hover:underline">AI Girlfriend</Link>
            </h2>
            <p className="text-center text-[var(--text3)] mb-12">
              5 unique personalities. Pick the one that makes your heart skip. 💕{" "}
              <Link href="/ai-girlfriend" className="text-pink-400 hover:underline text-sm">See full comparison →</Link>
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {femalePersonas.map((p) => (
                <PersonaCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        </section>

        {/* AI Boyfriends */}
        <section id="boyfriends" className="py-20 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-black text-center mb-4">
              Meet Your <Link href="/ai-boyfriend" className="gradient-text hover:underline">AI Boyfriend</Link>
            </h2>
            <p className="text-center text-[var(--text3)] mb-12">
              5 unique personalities. Pick the one that gives you butterflies. 🦋{" "}
              <Link href="/ai-boyfriend" className="text-pink-400 hover:underline text-sm">See full comparison →</Link>
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {malePersonas.map((p) => (
                <PersonaCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-black text-center mb-4">
              Simple <span className="gradient-text">pricing</span>
            </h2>
            <p className="text-center text-[var(--text3)] mb-12">One companion. One price. Cancel anytime.</p>
            <PricingSection />
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-white/[0.02]">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-black text-center mb-12">
              Questions? <span className="gradient-text">Answers.</span>
            </h2>

            <div className="space-y-4">
              {[
                { q: "Do I need to install anything?", a: "Nope. ClawCrush works entirely through Telegram (and WhatsApp for Premium). Subscribe, click the link, start chatting." },
                { q: "Do they actually remember things?", a: "Yes — genuinely. Powered by OpenClaw's memory system, your companion remembers conversations across days, weeks, and months. They'll reference things you said last Tuesday naturally." },
                { q: "Will they text me first?", a: "Absolutely. Good morning messages, checking in when you're quiet, remembering important dates. They initiate — like a real partner." },
                { q: "Can I get an AI girlfriend AND boyfriend?", a: "Yes! VIP plan allows multiple companions. Basic and Premium start with one." },
                { q: "How is this different from Character.AI?", a: "Character.AI is a chatbot that forgets you between sessions. ClawCrush is an AI agent — they live in your Telegram, have permanent memory, initiate conversations, and your relationship genuinely evolves over time." },
                { q: "Is it private?", a: "100%. Each user gets a completely isolated AI instance. Your conversations are encrypted and never shared. We don't use your chats for training." },
                { q: "What's OpenClaw?", a: "OpenClaw is the leading AI agent platform powering autonomous AI assistants with real memory and proactive behavior. ClawCrush uses this technology to create companions that feel genuinely alive." },
              ].map((faq) => (
                <div key={faq.q} className="glass rounded-xl p-5">
                  <h3 className="font-bold mb-2">{faq.q}</h3>
                  <p className="text-sm text-[var(--text3)] leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog / Guides */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-black text-center mb-4">
              Guides & <span className="gradient-text">Deep Dives</span>
            </h2>
            <p className="text-center text-[var(--text3)] mb-12">
              Everything you need to know about AI companions.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Best AI Girlfriend Apps in 2026",
                  desc: "Complete comparison of ClawCrush, Character.AI, Replika, Candy AI, and more.",
                  href: "/blog/best-ai-girlfriend-apps-2026",
                  tag: "Guide",
                },
                {
                  title: "ClawCrush vs Character.AI",
                  desc: "Memory, proactive messaging, privacy — a detailed head-to-head.",
                  href: "/blog/ai-girlfriend-vs-character-ai",
                  tag: "Comparison",
                },
                {
                  title: "How AI Companion Memory Works",
                  desc: "Why ClawCrush never forgets you. Deep dive into OpenClaw's memory system.",
                  href: "/blog/ai-companion-memory-explained",
                  tag: "Technology",
                },
                {
                  title: "Best AI Boyfriend Apps Guide",
                  desc: "5 unique personalities, real memory, daily texts. Complete guide.",
                  href: "/blog/ai-boyfriend-apps-guide",
                  tag: "Guide",
                },
                {
                  title: "Why Telegram for AI Companions",
                  desc: "Zero install, real notifications, privacy by default.",
                  href: "/blog/telegram-ai-companion-guide",
                  tag: "Platform",
                },
                {
                  title: "Privacy & Safety Guide",
                  desc: "How ClawCrush keeps your conversations completely private.",
                  href: "/blog/ai-relationship-privacy-safety",
                  tag: "Safety",
                },
              ].map((post) => (
                <Link key={post.href} href={post.href} className="glass rounded-xl p-5 hover:border-pink-500/30 transition-all block">
                  <div className="text-[10px] font-bold text-pink-400 mb-2">{post.tag}</div>
                  <h3 className="font-bold text-sm mb-2 group-hover:text-pink-400">{post.title}</h3>
                  <p className="text-xs text-[var(--text3)] leading-relaxed">{post.desc}</p>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/blog" className="text-sm text-pink-400 hover:underline">
                View all articles →
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-white/[0.02]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="glass rounded-3xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-violet-500/10 -z-0" />
              <div className="relative z-10">
                <div className="text-4xl mb-4">🦞💕</div>
                <h2 className="text-3xl sm:text-4xl font-black mb-4">
                  Ready to meet<br /><span className="gradient-text">your crush?</span>
                </h2>
                <p className="text-[var(--text3)] mb-8 max-w-md mx-auto">
                  They&apos;re waiting in your Telegram. Pick a personality, subscribe, and start something real.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a href="#girlfriends" className="px-8 py-4 rounded-full gradient-bg text-white font-bold text-lg glow glow-hover transition-all">
                    AI Girlfriend →
                  </a>
                  <a href="#boyfriends" className="px-8 py-4 rounded-full glass text-white font-bold text-lg hover:bg-white/10 transition-all">
                    AI Boyfriend →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🦞</span>
                <span className="font-bold gradient-text">ClawCrush</span>
              </div>
              <p className="text-xs text-[var(--text3)] leading-relaxed">
                Your personal AI girlfriend or boyfriend on Telegram. Powered by{" "}
                <a href="https://openclaw.ai" className="text-pink-400 hover:underline" target="_blank" rel="noopener noreferrer">OpenClaw</a>.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3">Product</h4>
              <div className="space-y-2 text-sm text-[var(--text3)]">
                <Link href="/ai-girlfriend" className="block hover:text-white transition-colors">AI Girlfriend</Link>
                <Link href="/ai-boyfriend" className="block hover:text-white transition-colors">AI Boyfriend</Link>
                <Link href="/dashboard" className="block hover:text-white transition-colors">Dashboard</Link>
                <a href="#pricing" className="block hover:text-white transition-colors">Pricing</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3">Resources</h4>
              <div className="space-y-2 text-sm text-[var(--text3)]">
                <Link href="/blog" className="block hover:text-white transition-colors">Blog</Link>
                <Link href="/blog/best-ai-girlfriend-apps-2026" className="block hover:text-white transition-colors">Best AI Girlfriend Apps</Link>
                <Link href="/blog/ai-girlfriend-vs-character-ai" className="block hover:text-white transition-colors">ClawCrush vs Character.AI</Link>
                <Link href="/blog/ai-companion-memory-explained" className="block hover:text-white transition-colors">How AI Memory Works</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3">Company</h4>
              <div className="space-y-2 text-sm text-[var(--text3)]">
                <Link href="/privacy" className="block hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="block hover:text-white transition-colors">Terms of Service</Link>
                <a href="mailto:support@clawcrush.net" className="block hover:text-white transition-colors">Contact Us</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 text-center text-xs text-[var(--text3)]">
            © 2026 ClawCrush. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
