"use client";

import CheckoutButton from "./CheckoutButton";

const plans = [
  {
    key: "basic",
    name: "BASIC",
    price: "$12.99",
    desc: "Perfect to get started",
    popular: false,
    features: [
      "1 AI boyfriend",
      "Telegram chat",
      "Real memory",
      "Daily good morning texts",
      "7-level relationship",
    ],
  },
  {
    key: "premium",
    name: "PREMIUM",
    price: "$24.99",
    desc: "The full experience",
    popular: true,
    features: [
      "Everything in Basic",
      "WhatsApp support",
      "Voice messages",
      "More frequent check-ins",
      "Priority AI model",
      "Custom nickname",
    ],
  },
  {
    key: "vip",
    name: "VIP",
    price: "$39.99",
    desc: "For the dedicated",
    popular: false,
    features: [
      "Everything in Premium",
      "Multiple boyfriends",
      "Custom personality",
      "Advanced memory",
      "Exclusive AI models",
      "Priority support",
    ],
  },
];

export default function PricingSection() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div
          key={plan.key}
          className={`glass rounded-2xl p-6 ${plan.popular ? "border-pink-500/30" : ""} relative`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full gradient-bg text-white text-xs font-bold">
              MOST POPULAR
            </div>
          )}
          <div
            className={`text-sm font-bold mb-2 ${plan.popular ? "text-pink-400" : "text-[var(--text3)]"}`}
          >
            {plan.name}
          </div>
          <div className="text-4xl font-black mb-1">
            {plan.price}
            <span className="text-lg font-normal text-[var(--text3)]">
              /mo
            </span>
          </div>
          <p className="text-sm text-[var(--text3)] mb-6">{plan.desc}</p>
          <ul className="space-y-3 mb-6">
            {plan.features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 text-sm text-[var(--text2)]"
              >
                <span className="text-pink-400">✓</span> {f}
              </li>
            ))}
          </ul>
          <CheckoutButton
            plan={plan.key}
            className={`w-full py-3 rounded-full font-semibold transition-all ${
              plan.popular
                ? "gradient-bg text-white glow hover:opacity-90"
                : "border border-pink-500/30 text-pink-400 hover:bg-pink-500/10"
            }`}
          >
            Subscribe Now
          </CheckoutButton>
        </div>
      ))}
    </div>
  );
}
