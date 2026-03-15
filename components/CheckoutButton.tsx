"use client";

import { useState } from "react";

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
    try {
      // Ad attribution
      const gclid = typeof window !== 'undefined' ? localStorage.getItem('gclid') : null;
      const utmSource = typeof window !== 'undefined' ? localStorage.getItem('utm_source') : null;
      const utmCampaign = typeof window !== 'undefined' ? localStorage.getItem('utm_campaign') : null;
      const utmTerm = typeof window !== 'undefined' ? localStorage.getItem('utm_term') : null;

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, boyfriendId, gclid: gclid || undefined, utmSource: utmSource || undefined, utmCampaign: utmCampaign || undefined, utmTerm: utmTerm || undefined }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch {
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
