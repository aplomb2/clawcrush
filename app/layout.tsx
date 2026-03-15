import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.clawcrush.net"),
  title: {
    default: "ClawCrush — AI Girlfriend & Boyfriend on Telegram | Powered by OpenClaw",
    template: "%s | ClawCrush",
  },
  description:
    "Your personal AI girlfriend or boyfriend on Telegram. Real memory, real conversations — they text you first and your relationship grows over time. 10 unique personalities. No app install. Powered by OpenClaw.",
  keywords: [
    "AI girlfriend",
    "AI girlfriend app",
    "AI boyfriend",
    "AI boyfriend app",
    "AI companion Telegram",
    "virtual girlfriend",
    "virtual boyfriend",
    "AI chat companion",
    "OpenClaw AI",
    "AI relationship",
    "Telegram AI girlfriend",
    "Telegram AI boyfriend",
    "AI companion app",
  ],
  alternates: {
    canonical: "https://www.clawcrush.net",
  },
  openGraph: {
    type: "website",
    url: "https://www.clawcrush.net",
    title: "ClawCrush — AI Girlfriend & Boyfriend on Telegram",
    description:
      "Your personal AI girlfriend or boyfriend on Telegram. Real memory, they text you first, relationship grows over time.",
    siteName: "ClawCrush",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClawCrush — AI Girlfriend & Boyfriend on Telegram",
    description:
      "Your personal AI companion on Telegram. Real memory, they text first, relationship grows. 10 unique personalities 🦞",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* GA4 + gclid tracking for ad ROAS attribution */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-CLAWCRUSH01"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CLAWCRUSH01');

              (function() {
                var params = new URLSearchParams(window.location.search);
                var gclid = params.get('gclid');
                if (gclid) {
                  document.cookie = '_gcl_aw=' + gclid + ';max-age=' + (90*86400) + ';path=/;SameSite=Lax';
                  try { localStorage.setItem('gclid', gclid); localStorage.setItem('gclid_ts', Date.now()); } catch(e) {}
                }
                ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(function(p) {
                  var v = params.get(p);
                  if (v) try { localStorage.setItem(p, v); } catch(e) {}
                });
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
