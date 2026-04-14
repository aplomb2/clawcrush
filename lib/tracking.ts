/**
 * Unified conversion tracking — fires both GA4 and Google Ads events.
 *
 * Google Ads conversion labels are placeholders (TODO_LABEL_xxx).
 * After creating conversions in Google Ads UI, replace them with real labels.
 *
 * GA4 Measurement ID : G-D3C6CQ0YCW
 * Google Ads ID      : AW-XXXXXXXXX  ← replace in layout.tsx
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// ─── Google Ads Conversion ID ────────────────────────────────────────
// Replace with your real AW-ID after creating the Google Ads account
const AW_ID = "AW-17730884015";

// ─── Conversion labels (replace after creating in Google Ads UI) ─────
const LABELS = {
  sign_up: "hBRACKO9p5wcEK-j34ZC",
  begin_checkout: "mrO4CLaFk5wcEK-j34ZC",
  purchase: "xPxuCMCDk5wcEK-j34ZC",
  agent_activated: "qDwOCNGFk5wcEK-j34ZC",
} as const;

// ─── Helper ──────────────────────────────────────────────────────────

function gadsConversion(
  label: string,
  params?: Record<string, unknown>,
) {
  window.gtag?.("event", "conversion", {
    send_to: `${AW_ID}/${label}`,
    ...params,
  });
}

// ─── Public API ──────────────────────────────────────────────────────

/** New user signs up (first-time Google OAuth). Primary conversion. */
export function trackSignUp(method = "google") {
  // GA4
  window.gtag?.("event", "sign_up", {
    method,
  });
  // Google Ads
  gadsConversion(LABELS.sign_up);
}

/** Returning user logs in (session restore or re-auth). GA4 only. */
export function trackLogin(method = "google") {
  window.gtag?.("event", "login", { method });
}

/** User clicks "Choose [persona]" — micro-conversion / intent signal. GA4 only. */
export function trackSelectPersona(personaId: string, personaName: string) {
  window.gtag?.("event", "select_persona", {
    event_category: "engagement",
    persona_id: personaId,
    persona_name: personaName,
  });
}

/** Stripe checkout initiated. */
export function trackBeginCheckout(params: {
  plan: string;
  value: number;
  personaId: string;
}) {
  // GA4 (enhanced ecommerce)
  window.gtag?.("event", "begin_checkout", {
    currency: "USD",
    value: params.value,
    items: [{ item_name: params.plan, price: params.value }],
  });
  // Google Ads
  gadsConversion(LABELS.begin_checkout, {
    value: params.value,
    currency: "USD",
  });
}

/** Payment completed — the key ROAS event. Must include value. */
export function trackPurchase(params: {
  transactionId: string;
  value: number;
  plan: string;
  personaId?: string;
}) {
  // GA4 (enhanced ecommerce)
  window.gtag?.("event", "purchase", {
    transaction_id: params.transactionId,
    currency: "USD",
    value: params.value,
    items: [{ item_name: params.plan, price: params.value }],
  });
  // Google Ads — primary conversion for tROAS bidding
  gadsConversion(LABELS.purchase, {
    value: params.value,
    currency: "USD",
    transaction_id: params.transactionId,
  });
}

/** Agent is active and Telegram link ready. Final funnel step. */
export function trackAgentActivated(params: {
  personaId: string;
  plan: string;
  value: number;
}) {
  // GA4
  window.gtag?.("event", "agent_activated", {
    event_category: "conversion",
    event_label: params.personaId,
    value: params.value,
    currency: "USD",
  });
  // Google Ads
  gadsConversion(LABELS.agent_activated, {
    value: params.value,
    currency: "USD",
  });
}

/** User submits Telegram bot token. GA4 only (engagement). */
export function trackBotTokenSubmitted(personaId: string) {
  window.gtag?.("event", "bot_token_submitted", {
    event_category: "engagement",
    event_label: personaId,
  });
}

/** User clicks "Open Telegram" link. GA4 only (engagement). */
export function trackOpenTelegram(personaId: string) {
  window.gtag?.("event", "open_telegram_chat", {
    event_category: "engagement",
    event_label: personaId,
  });
}

/** CTA click on landing page. GA4 only. */
export function trackCtaClick(label: string, url: string) {
  window.gtag?.("event", "cta_click", {
    event_category: "engagement",
    event_label: label,
    link_url: url,
  });
}

/** Billing portal opened. GA4 only. */
export function trackOpenBillingPortal() {
  window.gtag?.("event", "open_billing_portal", {
    event_category: "subscription",
  });
}

/** Quiz completed. GA4 only. */
export function trackQuizCompleted(result: string) {
  window.gtag?.("event", "quiz_completed", {
    event_category: "engagement",
    event_label: result,
  });
}

/** Quiz → choose persona. GA4 only. */
export function trackQuizChoosePersona(personaId: string) {
  window.gtag?.("event", "quiz_choose_persona", {
    event_category: "conversion",
    event_label: personaId,
  });
}
