'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from "next/link";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Track purchase conversion in GA4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        event_category: 'conversion',
        transaction_id: sessionId || 'unknown',
        currency: 'USD',
      });
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">🦞💕</div>
        <h1 className="text-3xl font-black mb-4">
          Welcome to <span className="gradient-text">ClawCrush!</span>
        </h1>
        <p className="text-[var(--text3)] mb-6">
          Your AI boyfriend is being set up right now. You&apos;ll receive a Telegram
          link within a few minutes to start chatting.
        </p>
        <div className="glass rounded-2xl p-6 mb-6 text-left">
          <h2 className="font-bold mb-3">What happens next:</h2>
          <ol className="space-y-3 text-sm text-[var(--text2)]">
            <li className="flex gap-3">
              <span className="text-pink-400 font-bold">1.</span>
              Check your email for the Telegram bot link
            </li>
            <li className="flex gap-3">
              <span className="text-pink-400 font-bold">2.</span>
              Click the link to open Telegram
            </li>
            <li className="flex gap-3">
              <span className="text-pink-400 font-bold">3.</span>
              Say hi — he&apos;s already excited to meet you 😊
            </li>
          </ol>
        </div>
        <p className="text-xs text-[var(--text3)] mb-6">
          Didn&apos;t get the link? Check spam or contact{" "}
          <a href="mailto:support@clawcrush.net" className="text-pink-400">
            support@clawcrush.net
          </a>
        </p>
        <Link
          href="/"
          className="text-sm text-[var(--text3)] hover:text-white transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg)]" />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
