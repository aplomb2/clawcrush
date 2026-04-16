"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";

const POSTHOG_KEY = "phc_qc8K3Xm7vFFx7GApwxQLWMUosps7A5fY7ytbFxzWFvt4";
const POSTHOG_HOST = "https://us.i.posthog.com";

if (typeof window !== "undefined" && !posthog.__loaded) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false, // we track manually for App Router
    capture_pageleave: true,
    persistence: "localStorage+cookie",
  });

  // Attach ad-attribution params as super properties so every event carries them
  try {
    const attribution: Record<string, string> = {};
    const gclid = localStorage.getItem("cc_gclid") || localStorage.getItem("gclid");
    if (gclid) attribution.cc_gclid = gclid;
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((k) => {
      const v = localStorage.getItem(k);
      if (v) attribution[k] = v;
    });
    if (Object.keys(attribution).length) posthog.register(attribution);
  } catch {
    // localStorage unavailable (private browsing etc.) — ignore
  }
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (!pathname || !ph) return;
    const qs = searchParams?.toString();
    const url = window.location.origin + pathname + (qs ? `?${qs}` : "");
    ph.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams, ph]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}
