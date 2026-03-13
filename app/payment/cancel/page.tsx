import Link from "next/link";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">😢</div>
        <h1 className="text-3xl font-black mb-4">Changed your mind?</h1>
        <p className="text-[var(--text3)] mb-8">
          No worries — he&apos;ll be here whenever you&apos;re ready.
        </p>
        <Link
          href="/#choose"
          className="inline-flex px-8 py-3 rounded-full gradient-bg text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Go back & explore →
        </Link>
      </div>
    </div>
  );
}
