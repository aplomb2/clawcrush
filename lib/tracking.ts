/**
 * Unified conversion tracking — three-track fan-out:
 *   1. PostHog   (product analytics, autocapture + manual events)
 *   2. GA4       (event telemetry, linked to Google Ads)
 *   3. Google Ads (explicit conversion pixels for bidding)
 *
 * Event names follow the ClawCrush schema. Each helper below fires
 * the right subset of the three channels for its event type.
 *
 * Identifiers:
 *   GA4 Measurement ID : G-D3C6CQ0YCW          (app/layout.tsx)
 *   Google Ads ID      : AW-17730884015        (app/layout.tsx)
 */

import posthog from "posthog-js";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// ─── Google Ads conversion labels ────────────────────────────────────
const AW_ID = "AW-17730884015";

const LABELS = {
  sign_up: "hBRACKO9p5wcEK-j34ZC",
  begin_checkout: "mrO4CLaFk5wcEK-j34ZC",
  purchase: "xPxuCMCDk5wcEK-j34ZC",
  agent_activated: "qDwOCNGFk5wcEK-j34ZC",
} as const;

// ─── Helpers ─────────────────────────────────────────────────────────

function gadsConversion(label: string, params?: Record<string, unknown>) {
  window.gtag?.("event", "conversion", {
    send_to: `${AW_ID}/${label}`,
    ...params,
  });
}

function ph(event: string, props?: Record<string, unknown>) {
  // posthog-js is a no-op on server-side and before init
  if (typeof window !== "undefined") posthog.capture(event, props);
}

function ga(event: string, props?: Record<string, unknown>) {
  window.gtag?.("event", event, props);
}

// ─── Acquisition / Onboarding funnel ─────────────────────────────────

/** Main CTA on landing page clicked. */
export function trackCtaClick(ctaName: string, page: string, url?: string) {
  ph("cta_clicked", { cta_name: ctaName, page, url });
  ga("cta_click", {
    event_category: "engagement",
    event_label: ctaName,
    link_url: url,
  });
}

/** User clicked a companion card (persona tile). */
export function trackCompanionCardClicked(params: {
  companionId: string;
  companionName: string;
  category: "gf" | "bf";
  position?: number;
  page?: string;
}) {
  ph("companion_card_clicked", {
    companion_id: params.companionId,
    companion_name: params.companionName,
    category: params.category,
    position: params.position,
    page: params.page,
  });
  ga("select_persona", {
    event_category: "engagement",
    persona_id: params.companionId,
    persona_name: params.companionName,
  });
}

/** User enters a companion detail / setup screen (dashboard modal etc.). */
export function trackCompanionViewed(companionId: string, companionName: string) {
  ph("companion_viewed", {
    companion_id: companionId,
    companion_name: companionName,
  });
}

/** User clicked a Telegram entry (open link, share etc.). */
export function trackTelegramLinkClicked(sourcePage: string) {
  ph("telegram_link_clicked", { source_page: sourcePage });
}

/** Sign-in modal / screen shown. */
export function trackLoginPrompted(
  trigger: "start_chat" | "manual" | "paywall" | "dashboard",
) {
  ph("login_prompted", { trigger });
}

/** New user finishes Google OAuth. Fires Google Ads conversion. */
export function trackSignedUp(method = "google") {
  ph("signed_up", { method, is_new_user: true });
  ga("sign_up", { method });
  gadsConversion(LABELS.sign_up);
}

/** Returning user finishes auth (popup or session restore). */
export function trackSignedIn(method = "google") {
  ph("signed_in", { method, is_new_user: false });
  ga("login", { method });
}

/** Auth failure (user cancelled popup, network error, etc.). */
export function trackLoginFailed(errorType: string) {
  ph("login_failed", { error_type: errorType });
  ga("login_failed", { event_category: "auth", error_type: errorType });
}

// ─── Chat / Activation funnel ────────────────────────────────────────

/** User opened the Telegram chat (the "chat start" event on our side). */
export function trackChatStarted(params: {
  companionId: string;
  isLoggedIn: boolean;
  source?: string;
}) {
  ph("chat_started", {
    companion_id: params.companionId,
    is_logged_in: params.isLoggedIn,
    source: params.source,
  });
  ga("open_telegram_chat", {
    event_category: "engagement",
    event_label: params.companionId,
  });
}

/**
 * Agent fully activated — the core conversion signal on our side.
 * Fires on all three channels (PostHog + GA4 + Google Ads).
 *
 * Note: message-level events (first_message_sent, message_sent,
 * message_send_failed) happen inside Telegram and must be emitted
 * from Angela (OpenClaw) — they cannot be captured from the website.
 */
export function trackAgentActivated(params: {
  companionId: string;
  plan: string;
  value: number;
  messagesExchanged?: number;
}) {
  ph("agent_activated", {
    companion_id: params.companionId,
    plan: params.plan,
    value: params.value,
    messages_exchanged: params.messagesExchanged,
  });
  ga("agent_activated", {
    event_category: "conversion",
    event_label: params.companionId,
    value: params.value,
    currency: "USD",
  });
  gadsConversion(LABELS.agent_activated, {
    value: params.value,
    currency: "USD",
  });
}

/** User submits Telegram bot token. */
export function trackBotTokenSubmitted(companionId: string) {
  ph("bot_token_submitted", { companion_id: companionId });
  ga("bot_token_submitted", {
    event_category: "engagement",
    event_label: companionId,
  });
}

// ─── Paywall / Payment funnel ────────────────────────────────────────

/** Paywall modal / redirect triggered. */
export function trackPaywallShown(params: {
  trigger: "free_messages_used" | "vip_feature" | "plan_selector" | "checkout";
  messagesSentSoFar?: number;
  companionId?: string;
}) {
  ph("paywall_shown", {
    trigger: params.trigger,
    messages_sent_so_far: params.messagesSentSoFar,
    companion_id: params.companionId,
  });
}

/** User closed / bailed out of the paywall. */
export function trackPaywallDismissed(params: {
  trigger: string;
  timeOnPaywallSec: number;
}) {
  ph("paywall_dismissed", {
    trigger: params.trigger,
    time_on_paywall_sec: params.timeOnPaywallSec,
  });
}

/** User kicked off Stripe checkout. Fires Google Ads conversion. */
export function trackCheckoutStarted(params: {
  plan: string;
  planPriceUsd: number;
  companionId?: string;
}) {
  ph("checkout_started", {
    plan_name: params.plan,
    plan_price_usd: params.planPriceUsd,
    companion_id: params.companionId,
  });
  ga("begin_checkout", {
    currency: "USD",
    value: params.planPriceUsd,
    items: [{ item_name: params.plan, price: params.planPriceUsd }],
  });
  gadsConversion(LABELS.begin_checkout, {
    value: params.planPriceUsd,
    currency: "USD",
  });
}

/** Payment success. The ROAS-bearing conversion event. */
export function trackPurchaseCompleted(params: {
  orderId: string;
  plan: string;
  planPriceUsd: number;
  companionId?: string;
}) {
  ph("purchase_completed", {
    order_id: params.orderId,
    plan_name: params.plan,
    plan_price_usd: params.planPriceUsd,
    companion_id: params.companionId,
  });
  ga("purchase", {
    transaction_id: params.orderId,
    currency: "USD",
    value: params.planPriceUsd,
    items: [{ item_name: params.plan, price: params.planPriceUsd }],
  });
  gadsConversion(LABELS.purchase, {
    value: params.planPriceUsd,
    currency: "USD",
    transaction_id: params.orderId,
  });
}

/** Payment failed / checkout session couldn't be created. */
export function trackPurchaseFailed(reason: string, plan?: string) {
  ph("purchase_failed", { reason, plan_name: plan });
  ga("purchase_failed", {
    event_category: "conversion",
    reason,
  });
}

// ─── Misc existing events (kept for back-compat) ─────────────────────

export function trackOpenBillingPortal() {
  ph("billing_portal_opened");
  ga("open_billing_portal", { event_category: "subscription" });
}

export function trackQuizCompleted(result: string) {
  ph("quiz_completed", { result });
  ga("quiz_completed", {
    event_category: "engagement",
    event_label: result,
  });
}

export function trackQuizChoosePersona(companionId: string) {
  ph("quiz_choose_persona", { companion_id: companionId });
  ga("quiz_choose_persona", {
    event_category: "conversion",
    event_label: companionId,
  });
}
