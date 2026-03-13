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
    default: "ClawCrush — Your AI Boyfriend on Telegram | Powered by OpenClaw",
    template: "%s | ClawCrush",
  },
  description:
    "Get your own AI boyfriend on Telegram. He remembers everything, texts you first, and his personality grows with your relationship. No app install — just chat. Powered by OpenClaw.",
  keywords: [
    "AI boyfriend",
    "AI boyfriend app",
    "AI companion Telegram",
    "virtual boyfriend",
    "AI chat boyfriend",
    "OpenClaw AI",
    "AI relationship",
    "Telegram AI boyfriend",
  ],
  alternates: {
    canonical: "https://www.clawcrush.net",
  },
  openGraph: {
    type: "website",
    url: "https://www.clawcrush.net",
    title: "ClawCrush — Your AI Boyfriend on Telegram",
    description:
      "He remembers everything, texts you first, and grows with you. No app install — just Telegram.",
    siteName: "ClawCrush",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClawCrush — Your AI Boyfriend on Telegram",
    description:
      "He remembers everything, texts you first, and grows with you. Powered by OpenClaw 🦞",
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
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
