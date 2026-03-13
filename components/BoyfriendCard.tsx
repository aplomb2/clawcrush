"use client";

import CheckoutButton from "./CheckoutButton";

interface BoyfriendType {
  id: string;
  emoji: string;
  name: string;
  type: string;
  typeZh: string;
  age: number;
  desc: string;
  traits: string[];
  preview: { from: string; text: string }[];
  color: string;
}

export default function BoyfriendCard({ bf }: { bf: BoyfriendType }) {
  return (
    <div className="glass rounded-2xl overflow-hidden hover:border-pink-500/30 transition-all group">
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

        <CheckoutButton
          plan="premium"
          boyfriendId={bf.id}
          className="mt-4 block w-full text-center py-2.5 rounded-full gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Choose {bf.name} →
        </CheckoutButton>
      </div>
    </div>
  );
}
