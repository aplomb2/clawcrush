export const PLANS = {
  basic: {
    name: "Basic",
    priceId: "price_1TAJpvKHshdCDDcgTshFmy85",
    price: 12.99,
    features: [
      "1 AI boyfriend",
      "Telegram chat",
      "Real memory",
      "Daily good morning texts",
      "7-level relationship",
    ],
  },
  premium: {
    name: "Premium",
    priceId: "price_1TAJpwKHshdCDDcg9qQ9fj5E",
    price: 24.99,
    features: [
      "Everything in Basic",
      "WhatsApp support",
      "Voice messages",
      "More frequent check-ins",
      "Priority AI model",
      "Custom nickname",
    ],
  },
  vip: {
    name: "VIP",
    priceId: "price_1TAJpxKHshdCDDcgmoBlPiT1",
    price: 39.99,
    features: [
      "Everything in Premium",
      "Multiple boyfriends",
      "Custom personality",
      "Advanced memory",
      "Exclusive AI models",
      "Priority support",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
