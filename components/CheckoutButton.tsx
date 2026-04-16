"use client";

import { useState } from "react";
import { PLANS, PlanKey } from "@/lib/stripe";
import {
  trackCheckoutStarted,
  trackPaywallShown,
  trackPurchaseFailed,
} from "@/lib/tracking";

interface CheckoutButtonProps {
  plan: string;
  boyfriendId?: string;
  className?: string;
  children: React.ReactNode;
}

export default function CheckoutButton({
  plan,
  boyfriendId,
  className,
  children,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const planPriceUsd = PLANS[plan as PlanKey]?.price ?? 0;

    try {
      // Paywall shown at the moment the user engages with pricing
      trackPaywallShown({
        trigger: "plan_selector",
        companionId: boyfriendId,
      });

      // Ad attribution — prefer canonical cc_gclid, fall back to legacy key
      const ls = typeof window !== "undefined" ? window.localStorage : null;
      const gclid = ls ? ls.getItem("cc_gclid") || ls.getItem("gclid") : null;
      const utmSource = ls?.getItem("utm_source");
      const utmCampaign = ls?.getItem("utm_campaign");
      const utmTerm = ls?.getItem("utm_term");

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          boyfriendId,
          gclid: gclid || undefined,
          utmSource: utmSource || undefined,
          utmCampaign: utmCampaign || undefined,
          utmTerm: utmTerm || undefined,
        }),
      });

      const data = await res.json();
      if (data.url) {
        trackCheckoutStarted({
          plan,
          planPriceUsd,
          companionId: boyfriendId,
        });
        window.location.href = data.url;
      } else {
        trackPurchaseFailed(data.error || "checkout_url_missing", plan);
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "network_error";
      trackPurchaseFailed(message, plan);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleCheckout} disabled={loading} className={className}>
      {loading ? "Redirecting..." : children}
    </button>
  );
}
