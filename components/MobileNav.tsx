'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button - mobile only */}
      <button
        onClick={() => setOpen(!open)}
        className="sm:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--text3)] hover:text-white transition-colors"
        aria-label="Toggle menu"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile dropdown menu */}
      {open && (
        <>
          <div
            className="fixed inset-0 top-14 bg-black/60 backdrop-blur-sm sm:hidden z-40"
            onClick={() => setOpen(false)}
          />
          <div className="sm:hidden absolute top-14 left-0 right-0 bg-[var(--bg)]/95 backdrop-blur-lg border-b border-white/5 z-50">
            <div className="flex flex-col px-6 py-3 gap-1">
              <a
                href="#how"
                onClick={() => setOpen(false)}
                className="text-[var(--text3)] hover:text-white transition-colors py-3 px-3 rounded-lg hover:bg-white/5 min-h-[44px] flex items-center"
              >
                How it works
              </a>
              <Link
                href="/ai-girlfriend"
                onClick={() => setOpen(false)}
                className="text-[var(--text3)] hover:text-white transition-colors py-3 px-3 rounded-lg hover:bg-white/5 min-h-[44px] flex items-center"
              >
                AI Girlfriend
              </Link>
              <Link
                href="/ai-boyfriend"
                onClick={() => setOpen(false)}
                className="text-[var(--text3)] hover:text-white transition-colors py-3 px-3 rounded-lg hover:bg-white/5 min-h-[44px] flex items-center"
              >
                AI Boyfriend
              </Link>
              <Link
                href="/blog"
                onClick={() => setOpen(false)}
                className="text-[var(--text3)] hover:text-white transition-colors py-3 px-3 rounded-lg hover:bg-white/5 min-h-[44px] flex items-center"
              >
                Blog
              </Link>
              <a
                href="#pricing"
                onClick={() => setOpen(false)}
                className="text-pink-400 hover:text-pink-300 font-medium transition-colors py-3 px-3 rounded-lg hover:bg-white/5 min-h-[44px] flex items-center"
              >
                Pricing
              </a>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="mt-2 text-center py-3 px-3 rounded-full gradient-bg text-white font-semibold hover:opacity-90 transition-opacity min-h-[44px] flex items-center justify-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
