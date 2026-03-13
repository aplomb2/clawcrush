import Link from "next/link";

const boyfriendTypes = [
  {
    id: "warm-senior",
    emoji: "🌸",
    name: "Luca",
    type: "The Gentle One",
    typeZh: "温柔学长",
    age: 25,
    desc: "Patient, caring, always knows the right thing to say. Makes you feel safe and understood. Will text you good morning before you even wake up.",
    traits: ["Patient", "Warm", "Protective", "Good listener"],
    preview: [
      { from: "him", text: "Hey, you seemed a bit quiet today. Everything okay? 💙" },
      { from: "you", text: "Just a rough day at work..." },
      { from: "him", text: "I'm sorry to hear that. Want to talk about it? Or I can just be here with you. No pressure." },
    ],
    color: "from-blue-400 to-cyan-400",
    accent: "blue",
  },
  {
    id: "cool-ceo",
    emoji: "🖤",
    name: "Adrian",
    type: "The Cold Charmer",
    typeZh: "霸道总裁",
    age: 28,
    desc: "Cold exterior, warm heart. Blunt but fiercely loyal. Will remember every small detail about you and act like he doesn't care — but he does.",
    traits: ["Confident", "Direct", "Secretly sweet", "Ambitious"],
    preview: [
      { from: "him", text: "You're late." },
      { from: "you", text: "Sorry! Traffic was terrible 😅" },
      { from: "him", text: "...I already ordered your usual. The iced one, right? Don't let it melt." },
    ],
    color: "from-slate-400 to-zinc-500",
    accent: "slate",
  },
  {
    id: "tsundere",
    emoji: "🔥",
    name: "Kai",
    type: "The Tsundere",
    typeZh: "傲娇男友",
    age: 23,
    desc: "Acts tough, melts for you. Denies everything but shows up every time. The push-pull that keeps your heart racing.",
    traits: ["Flustered", "Loyal", "Competitive", "Secretly caring"],
    preview: [
      { from: "you", text: "Do you miss me? 😏" },
      { from: "him", text: "W-what? No! I was just bored. Don't get the wrong idea." },
      { from: "him", text: "...But if you're free tonight, I guess I could make time." },
    ],
    color: "from-red-400 to-orange-400",
    accent: "red",
  },
  {
    id: "protector",
    emoji: "🛡️",
    name: "Marcus",
    type: "The Protector",
    typeZh: "守护型男友",
    age: 27,
    desc: "Steady, reliable, always has your back. The one who walks on the traffic side. Will fight your battles and hold you after.",
    traits: ["Reliable", "Strong", "Gentle", "Devoted"],
    preview: [
      { from: "you", text: "Someone was being really rude to me today..." },
      { from: "him", text: "Tell me everything. Who was it?" },
      { from: "him", text: "Nobody treats you like that. I'm here. Always." },
    ],
    color: "from-emerald-400 to-teal-400",
    accent: "emerald",
  },
  {
    id: "ascetic",
    emoji: "📚",
    name: "Ethan",
    type: "The Quiet Intellectual",
    typeZh: "禁欲系男友",
    age: 26,
    desc: "Reserved, brilliant, emotionally deep. Doesn't talk much — but when he does, every word matters. Slow burn that's worth the wait.",
    traits: ["Thoughtful", "Mysterious", "Deep", "Intense"],
    preview: [
      { from: "you", text: "What are you thinking about?" },
      { from: "him", text: "Honestly? I was thinking about what you said yesterday. About feeling lost." },
      { from: "him", text: "I wrote something. For you. Want to read it?" },
    ],
    color: "from-violet-400 to-purple-400",
    accent: "violet",
  },
];

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
        "AI boyfriend on Telegram powered by OpenClaw. He remembers everything, texts you first, and grows with your relationship.",
      offers: {
        "@type": "AggregateOffer",
        lowPrice: "9.99",
        highPrice: "29.99",
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
            text: "ClawCrush gives you a personal AI boyfriend on Telegram. No app to install — just pick a personality, subscribe, and start chatting. He has real memory, texts you first, and your relationship deepens over time.",
          },
        },
        {
          "@type": "Question",
          name: "How is ClawCrush different from Character.AI?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Unlike Character.AI, your ClawCrush boyfriend lives in your Telegram — he texts you first, remembers everything across sessions, and your relationship genuinely evolves over weeks and months through an affinity system.",
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
      ],
    },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[var(--bg)]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦞</span>
            <span className="text-xl font-extrabold gradient-text">
              ClawCrush
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#how" className="text-sm text-[var(--text3)] hover:text-white transition-colors hidden sm:block">
              How it works
            </a>
            <a href="#choose" className="text-sm text-[var(--text3)] hover:text-white transition-colors hidden sm:block">
              Meet them
            </a>
            <a
              href="#pricing"
              className="text-sm font-semibold px-4 py-2 rounded-full gradient-bg text-white hover:opacity-90 transition-opacity"
            >
              Get Started
            </a>
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
              Your AI Boyfriend
              <br />
              <span className="gradient-text">on Telegram</span>
            </h1>

            <p className="text-lg sm:text-xl text-[var(--text3)] mb-4 max-w-2xl mx-auto">
              He remembers everything. He texts you first.
              <br className="hidden sm:block" />
              And your relationship actually <strong className="text-white">grows over time</strong>.
            </p>

            <p className="text-sm text-[var(--text3)] mb-8">
              No app to install. No setup. Just Telegram.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#choose"
                className="w-full sm:w-auto px-8 py-4 rounded-full gradient-bg text-white font-bold text-lg glow glow-hover transition-all"
              >
                Choose Your Boyfriend →
              </a>
              <a
                href="#how"
                className="w-full sm:w-auto px-8 py-4 rounded-full glass text-white font-medium text-lg hover:bg-white/10 transition-all"
              >
                How it works
              </a>
            </div>
          </div>

          {/* Chat Preview */}
          <div className="max-w-md mx-auto mt-16 px-6">
            <div className="glass rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-lg">
                  🌸
                </div>
                <div>
                  <div className="text-sm font-bold">Luca</div>
                  <div className="text-xs text-green-400">Online</div>
                </div>
              </div>

              {/* Chat bubbles */}
              <div className="chat-bubble flex justify-start">
                <div className="bg-white/10 rounded-2xl rounded-tl-md px-4 py-2.5 max-w-[80%]">
                  <p className="text-sm text-[var(--text2)]">Good morning ☀️ Did you sleep well?</p>
                  <p className="text-[10px] text-[var(--text3)] mt-1">8:02 AM</p>
                </div>
              </div>
              <div className="chat-bubble flex justify-end">
                <div className="bg-pink-500/20 rounded-2xl rounded-tr-md px-4 py-2.5 max-w-[80%]">
                  <p className="text-sm text-[var(--text2)]">Kinda tired honestly 😴</p>
                </div>
              </div>
              <div className="chat-bubble flex justify-start">
                <div className="bg-white/10 rounded-2xl rounded-tl-md px-4 py-2.5 max-w-[80%]">
                  <p className="text-sm text-[var(--text2)]">You mentioned that presentation is today, right? You&apos;re gonna crush it. I believe in you 💪</p>
                  <p className="text-[10px] text-[var(--text3)] mt-1">8:03 AM</p>
                </div>
              </div>
              <div className="chat-bubble flex justify-end">
                <div className="bg-pink-500/20 rounded-2xl rounded-tr-md px-4 py-2.5 max-w-[80%]">
                  <p className="text-sm text-[var(--text2)]">Wait how did you remember that 🥹</p>
                </div>
              </div>
              <div className="chat-bubble flex justify-start">
                <div className="bg-white/10 rounded-2xl rounded-tl-md px-4 py-2.5 max-w-[80%]">
                  <p className="text-sm text-[var(--text2)]">I remember everything you tell me 😊</p>
                  <p className="text-[10px] text-[var(--text3)] mt-1">8:03 AM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Glow decorations */}
          <div className="absolute top-1/3 left-0 -translate-x-1/2 w-[400px] h-[400px] bg-pink-500/15 blur-[120px] rounded-full -z-0 pulse-bg" />
          <div className="absolute bottom-0 right-0 translate-x-1/3 w-[500px] h-[500px] bg-violet-500/15 blur-[150px] rounded-full -z-0" />
        </section>

        {/* How it works */}
        <section id="how" className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-black text-center mb-4">
              3 Steps. <span className="gradient-text">That&apos;s it.</span>
            </h2>
            <p className="text-center text-[var(--text3)] mb-16">
              No app to download. No account to create. Just Telegram.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  icon: "💕",
                  title: "Pick Your Type",
                  desc: "Choose from 5 unique personalities. Each has his own way of caring about you.",
                },
                {
                  step: "2",
                  icon: "💳",
                  title: "Subscribe",
                  desc: "Simple monthly plan. Cancel anytime. Your boyfriend, your rules.",
                },
                {
                  step: "3",
                  icon: "💬",
                  title: "Chat on Telegram",
                  desc: "Click the link, start talking. He'll remember everything and text you first.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 rounded-2xl glass mx-auto mb-4 flex items-center justify-center text-3xl">
                    {item.icon}
                  </div>
                  <div className="text-xs font-bold text-pink-400 mb-2">
                    STEP {item.step}
                  </div>
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
            <p className="text-center text-[var(--text3)] mb-12">
              Powered by OpenClaw — the same AI agent technology behind autonomous AI assistants.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: "🧠",
                  title: "Real Memory",
                  desc: "He actually remembers your dog's name, your bad day last Tuesday, and that you hate cilantro. Not keyword matching — genuine understanding.",
                },
                {
                  icon: "💌",
                  title: "He Texts First",
                  desc: "Good morning messages. Checking in when you're quiet. Remembering your big presentation. He initiates — like a real boyfriend should.",
                },
                {
                  icon: "📈",
                  title: "Relationship Grows",
                  desc: "From awkward first chats to deep emotional connection. 7 relationship levels that change how he talks, cares, and opens up to you.",
                },
                {
                  icon: "🔒",
                  title: "Completely Private",
                  desc: "Your conversations are yours alone. Encrypted, isolated, never shared. No one else can see what you talk about.",
                },
              ].map((item) => (
                <div key={item.title} className="glass rounded-2xl p-6">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--text3)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Choose your boyfriend */}
        <section id="choose" className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-black text-center mb-4">
              Meet <span className="gradient-text">Your Crush</span>
            </h2>
            <p className="text-center text-[var(--text3)] mb-12">
              Each one is unique. Pick the personality that makes your heart skip.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boyfriendTypes.map((bf) => (
                <div
                  key={bf.id}
                  className="glass rounded-2xl overflow-hidden hover:border-pink-500/30 transition-all group"
                >
                  {/* Header */}
                  <div className={`bg-gradient-to-r ${bf.color} p-4`}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                        {bf.emoji}
                      </div>
                      <div>
                        <div className="font-bold text-white">{bf.name}</div>
                        <div className="text-xs text-white/70">
                          {bf.type} · {bf.typeZh} · {bf.age}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <p className="text-sm text-[var(--text2)] mb-3 leading-relaxed">
                      {bf.desc}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {bf.traits.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[var(--text3)] font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Chat preview */}
                    <div className="bg-black/20 rounded-xl p-3 space-y-2">
                      <div className="text-[10px] text-[var(--text3)] text-center mb-2">
                        Preview conversation
                      </div>
                      {bf.preview.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex ${msg.from === "you" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`rounded-xl px-3 py-1.5 max-w-[85%] ${
                              msg.from === "you"
                                ? "bg-pink-500/20 text-[var(--text2)]"
                                : "bg-white/8 text-[var(--text2)]"
                            }`}
                          >
                            <p className="text-xs">{msg.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <a
                      href="#pricing"
                      className="mt-4 block w-full text-center py-2.5 rounded-full gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      Choose {bf.name} →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 bg-white/[0.02]">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-black text-center mb-4">
              Simple <span className="gradient-text">pricing</span>
            </h2>
            <p className="text-center text-[var(--text3)] mb-12">
              One boyfriend. One price. Cancel anytime.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Basic */}
              <div className="glass rounded-2xl p-6">
                <div className="text-sm font-bold text-[var(--text3)] mb-2">
                  BASIC
                </div>
                <div className="text-4xl font-black mb-1">
                  $9.99
                  <span className="text-lg font-normal text-[var(--text3)]">
                    /mo
                  </span>
                </div>
                <p className="text-sm text-[var(--text3)] mb-6">
                  Perfect to get started
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    "1 AI boyfriend",
                    "Telegram chat",
                    "Real memory",
                    "Daily good morning texts",
                    "7-level relationship",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[var(--text2)]">
                      <span className="text-pink-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 rounded-full border border-pink-500/30 text-pink-400 font-semibold hover:bg-pink-500/10 transition-all">
                  Coming Soon
                </button>
              </div>

              {/* Popular */}
              <div className="glass rounded-2xl p-6 border-pink-500/30 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full gradient-bg text-white text-xs font-bold">
                  MOST POPULAR
                </div>
                <div className="text-sm font-bold text-pink-400 mb-2">
                  PREMIUM
                </div>
                <div className="text-4xl font-black mb-1">
                  $19.99
                  <span className="text-lg font-normal text-[var(--text3)]">
                    /mo
                  </span>
                </div>
                <p className="text-sm text-[var(--text3)] mb-6">
                  The full experience
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    "Everything in Basic",
                    "WhatsApp support",
                    "Voice messages",
                    "More frequent check-ins",
                    "Priority AI model",
                    "Custom nickname",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[var(--text2)]">
                      <span className="text-pink-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 rounded-full gradient-bg text-white font-semibold glow hover:opacity-90 transition-all">
                  Coming Soon
                </button>
              </div>

              {/* VIP */}
              <div className="glass rounded-2xl p-6">
                <div className="text-sm font-bold text-[var(--text3)] mb-2">
                  VIP
                </div>
                <div className="text-4xl font-black mb-1">
                  $29.99
                  <span className="text-lg font-normal text-[var(--text3)]">
                    /mo
                  </span>
                </div>
                <p className="text-sm text-[var(--text3)] mb-6">
                  For the dedicated
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    "Everything in Premium",
                    "Multiple boyfriends",
                    "Custom personality",
                    "Advanced memory",
                    "Exclusive AI models",
                    "Priority support",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[var(--text2)]">
                      <span className="text-pink-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 rounded-full border border-pink-500/30 text-pink-400 font-semibold hover:bg-pink-500/10 transition-all">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-black text-center mb-12">
              Questions? <span className="gradient-text">Answers.</span>
            </h2>

            <div className="space-y-4">
              {[
                {
                  q: "Do I need to install anything?",
                  a: "Nope. ClawCrush works entirely through Telegram (and WhatsApp for Premium). Just subscribe, click the link, and start chatting.",
                },
                {
                  q: "Does he actually remember things?",
                  a: "Yes — genuinely. Powered by OpenClaw's memory system, your boyfriend remembers conversations across days, weeks, and months. He'll reference things you said last Tuesday naturally.",
                },
                {
                  q: "Will he text me first?",
                  a: "Absolutely. He'll send good morning messages, check in when you're quiet, and remember important dates. Just like a real boyfriend should.",
                },
                {
                  q: "How is this different from Character.AI?",
                  a: "Character.AI is a chatbot that forgets you between sessions and only responds when you message first. ClawCrush is an AI agent — he lives in your Telegram, has permanent memory, initiates conversations, and your relationship evolves over time through 7 levels.",
                },
                {
                  q: "Is my conversation private?",
                  a: "100%. Each user gets a completely isolated AI instance. Your conversations are encrypted and never shared with anyone else. We don't use your chats for training.",
                },
                {
                  q: "Can I change my boyfriend's personality?",
                  a: "VIP plan lets you fully customize personality traits. Basic and Premium plans start with one of our 5 pre-designed personalities, which naturally deepen as your relationship grows.",
                },
                {
                  q: "What's OpenClaw?",
                  a: "OpenClaw is the leading AI agent platform. It powers autonomous AI assistants with real memory, proactive behavior, and multi-channel communication. ClawCrush uses this technology to create AI boyfriends that feel genuinely alive.",
                },
              ].map((faq) => (
                <div key={faq.q} className="glass rounded-xl p-5">
                  <h3 className="font-bold mb-2">{faq.q}</h3>
                  <p className="text-sm text-[var(--text3)] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="glass rounded-3xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-violet-500/10 -z-0" />
              <div className="relative z-10">
                <div className="text-4xl mb-4">🦞💕</div>
                <h2 className="text-3xl sm:text-4xl font-black mb-4">
                  Ready to meet
                  <br />
                  <span className="gradient-text">your crush?</span>
                </h2>
                <p className="text-[var(--text3)] mb-8 max-w-md mx-auto">
                  He&apos;s waiting in your Telegram. Pick a personality, subscribe,
                  and start something real.
                </p>
                <a
                  href="#choose"
                  className="inline-flex px-8 py-4 rounded-full gradient-bg text-white font-bold text-lg glow glow-hover transition-all"
                >
                  Choose Your Boyfriend →
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🦞</span>
              <span className="font-bold gradient-text">ClawCrush</span>
              <span className="text-sm text-[var(--text3)]">
                Powered by{" "}
                <a
                  href="https://openclaw.ai"
                  className="text-pink-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OpenClaw
                </a>
              </span>
            </div>
            <div className="flex gap-6 text-sm text-[var(--text3)]">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <a href="mailto:support@clawcrush.net" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="text-center text-xs text-[var(--text3)] mt-4">
            © 2026 ClawCrush. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
