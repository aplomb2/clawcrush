import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - ClawCrush",
  description: "ClawCrush terms of service for AI companion subscriptions.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <h1 className="text-3xl font-black mb-8" style={{ color: "#fafafa" }}>Terms of Service</h1>
        <p className="text-sm text-[var(--text3)]">Last updated: March 12, 2026</p>

        <div className="space-y-6 text-[var(--text2)] text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#f0f0f0" }}>1. Service Description</h2>
            <p>ClawCrush provides AI companion services through Telegram. Each subscriber receives a dedicated AI agent with unique personality, persistent memory, and proactive messaging capabilities.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#f0f0f0" }}>2. Subscriptions</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Subscriptions are billed monthly through Stripe</li>
              <li>You can cancel anytime from the Stripe customer portal</li>
              <li>Cancellation takes effect at the end of the current billing period</li>
              <li>No refunds for partial months</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#f0f0f0" }}>3. Telegram Bot</h2>
            <p>You are responsible for creating your own Telegram bot through @BotFather. The bot token you provide is used exclusively to deliver your AI companion service. Do not share your bot token with others.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#f0f0f0" }}>4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use the service for illegal activities</li>
              <li>Attempt to access other users&apos; AI agents or data</li>
              <li>Resell or redistribute the service</li>
              <li>Use automated tools to abuse the system</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#f0f0f0" }}>5. AI Disclaimer</h2>
            <p>ClawCrush AI companions are entertainment products. They are not substitutes for real human relationships, therapy, or professional advice. The AI may occasionally produce inaccurate or unexpected responses.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#f0f0f0" }}>6. Service Availability</h2>
            <p>We strive for high availability but do not guarantee uninterrupted service. Maintenance windows may cause brief interruptions. We are not liable for losses caused by service downtime.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#f0f0f0" }}>7. Changes</h2>
            <p>We may update these terms with notice. Continued use after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#f0f0f0" }}>8. Contact</h2>
            <p>Questions? Email <a href="mailto:support@clawcrush.net" className="text-pink-400 hover:underline">support@clawcrush.net</a></p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <a href="/" className="text-sm text-pink-400 hover:underline">← Back to home</a>
        </div>
      </div>
    </div>
  );
}
