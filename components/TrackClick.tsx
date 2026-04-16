"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackCtaClick } from "@/lib/tracking";

/**
 * Delegated click handler for primary CTAs (links to /dashboard or buttons
 * containing "Subscribe"/"Get Started"/"Start Chatting"/"Get Matched").
 * Fires `cta_clicked` to PostHog and `cta_click` to GA4.
 */
export default function TrackClick() {
  const pathname = usePathname();

  useEffect(() => {
    const CTA_KEYWORDS = [
      "Subscribe",
      "Get Started",
      "Start Chatting",
      "Get Matched",
      "Choose",
      "Activate",
    ];

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const link = target.closest("a[href*='/dashboard'], button") as
        | HTMLElement
        | null;
      if (!link) return;

      const href = link.getAttribute("href") || "";
      const text = link.textContent?.trim() || "";
      const isCta =
        href.includes("/dashboard") ||
        CTA_KEYWORDS.some((kw) => text.includes(kw));
      if (!isCta) return;

      trackCtaClick(text.substring(0, 50), pathname || "/", href);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  return null;
}
