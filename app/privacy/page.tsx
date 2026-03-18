import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - ClawCrush",
  description: "ClawCrush privacy policy. How we protect your data and conversations.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <h1 className="text-3xl font-black mb-8" style={{ color: "#fafafa" }}>Privacy Policy</h1>
        <p className="text-sm text-[var(--text3)]">Last updated: March 12, 2026</p>

        <div className="space-y-6 text-[var(--text2)] text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#f0f0f0" }}>1. What We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Email address (via Google Sign-in) — for account identification</li>
              <li>Payment information — processed by Stripe (we never see your card details)</li>
              <li>Telegram bot token — to connect your AI companion</li>
              <li>Conversation data — stored in your private AI agent workspace</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#f0f0f0" }}>2. Data Isolation</h2>
            <p>Each user gets a <strong>completely isolated AI instance</strong>. Your conversations, memories, and personal data exist only in your private agent workspace. They are never:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Shared with other users</li>
              <li>Used to train AI models</li>
              <li>Sold to third parties</li>
              <li>Accessed by ClawCrush staff without your explicit permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#f0f0f0" }}>3. Data Storage</h2>
            <p>Conversation data is stored on secure servers. Your Telegram bot token is stored encrypted in our database and used solely to operate your AI companion.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#f0f0f0" }}>4. Data Deletion</h2>
            <p>When you cancel your subscription, your AI companion is deactivated. Your conversation data is retained for 30 days in case you resubscribe, then permanently deleted. You can request immediate deletion by contacting support@clawcrush.net.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#f0f0f0" }}>5. Third-Party Services</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Google Firebase</strong> — Authentication and database</li>
              <li><strong>Stripe</strong> — Payment processing</li>
              <li><strong>Telegram</strong> — Messaging platform</li>
              <li><strong>ClawRouters</strong> — AI model routing (no conversation data stored)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#f0f0f0" }}>6. Contact</h2>
            <p>Questions? Email us at <a href="mailto:support@clawcrush.net" className="text-pink-400 hover:underline">support@clawcrush.net</a></p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-sm text-pink-400 hover:underline">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
