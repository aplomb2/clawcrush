"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Tracks CTA clicks on the page by listening for clicks on links to /dashboard
 * and pricing buttons. Sends GA4 events for Google Ads conversion import.
 */
export default function TrackClick() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const link = target.closest("a[href*='/dashboard'], button");
      if (!link) return;

      const href = link.getAttribute("href") || "";
      const text = link.textContent?.trim() || "";

      // Track CTA clicks (Choose persona / Get Started / Subscribe)
      if (href.includes("/dashboard") || text.includes("Subscribe")) {
        window.gtag?.("event", "cta_click", {
          event_category: "conversion",
          event_label: text.substring(0, 50),
          link_url: href,
        });
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
