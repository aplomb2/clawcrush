"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Agent {
  agentId: string;
  boyfriendId: string;
  boyfriendName?: string;
  plan: string;
  status: string;
  telegramBotLink: string;
  createdAt: string;
}

const boyfriends = [
  {
    id: "warm-senior",
    name: "Luca",
    nameZh: "温柔学长",
    emoji: "💙",
    color: "from-blue-500 to-cyan-500",
    desc: "Patient, warm, and genuinely caring. He makes you feel safe with every word.",
  },
  {
    id: "cool-ceo",
    name: "Adrian",
    nameZh: "霸道总裁",
    emoji: "🖤",
    color: "from-slate-600 to-zinc-800",
    desc: 'Cold on the outside, burning inside. He\'ll deny caring — then do the sweetest things.',
  },
  {
    id: "tsundere",
    name: "Kai",
    nameZh: "傲娇男友",
    emoji: "🔥",
    color: "from-red-500 to-orange-500",
    desc: '"I-it\'s not like I was waiting for your message!" (He totally was.)',
  },
  {
    id: "protector",
    name: "Marcus",
    nameZh: "守护型男友",
    emoji: "🛡️",
    color: "from-emerald-600 to-teal-600",
    desc: "The steady rock in your life. Reliable, strong, and always there when you need him.",
  },
  {
    id: "ascetic",
    name: "Ethan",
    nameZh: "禁欲系男友",
    emoji: "🌙",
    color: "from-indigo-600 to-purple-700",
    desc: "Few words, but each one hits different. The slow burn that's worth the wait.",
  },
];

export default function DashboardPage() {
  const { user, loading, signInWithGoogle, signOut, getIdToken } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [userInfo, setUserInfo] = useState<{ isAdmin: boolean } | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchUserData = useCallback(async () => {
    const token = await getIdToken();
    if (!token) return;

    const res = await fetch("/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setUserInfo(data.user);
      setAgents(data.agents);
    }
  }, [getIdToken]);

  useEffect(() => {
    if (user) fetchUserData();
  }, [user, fetchUserData]);

  const createAgent = async (boyfriendId: string) => {
    setIsCreating(true);
    setError("");

    const token = await getIdToken();
    if (!token) return;

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ boyfriendId, plan: "premium" }),
      });

      const data = await res.json();

      if (data.requirePayment) {
        // Redirect to Stripe checkout
        const checkoutRes = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan: "premium",
            boyfriendId,
            userId: user?.uid,
            email: user?.email,
          }),
        });
        const checkoutData = await checkoutRes.json();
        if (checkoutData.url) {
          window.location.href = checkoutData.url;
        }
        return;
      }

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      // Success — refresh
      await fetchUserData();
    } catch (e) {
      setError("Network error. Please try again.");
      console.error(e);
    } finally {
      setIsCreating(false);
    }
  };

  // Not logged in
  if (!loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🦞</div>
          <h1 className="text-2xl font-bold mb-2">Welcome to ClawCrush</h1>
          <p className="text-[var(--text3)] mb-6">
            Sign in to meet your AI boyfriend
          </p>
          <button
            onClick={signInWithGoogle}
            className="w-full py-3 rounded-full gradient-bg text-white font-semibold glow hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>
          <p className="text-xs text-[var(--text3)] mt-4">
            <a href="/" className="hover:text-pink-400 transition-colors">
              ← Back to home
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--text3)]">Loading...</div>
      </div>
    );
  }

  // Logged in — Dashboard
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-[var(--text3)]">
              {user?.email}
              {userInfo?.isAdmin && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold">
                  ADMIN
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-sm text-[var(--text3)] hover:text-white transition-colors"
            >
              Home
            </a>
            <button
              onClick={signOut}
              className="text-sm text-[var(--text3)] hover:text-pink-400 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Active Agents */}
        {agents.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold mb-4">💕 Your AI Boyfriend</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {agents.map((agent) => {
                const bf = boyfriends.find((b) => b.id === agent.boyfriendId);
                return (
                  <div key={agent.agentId} className="glass rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-r ${bf?.color || "from-pink-500 to-rose-500"} flex items-center justify-center text-2xl`}
                      >
                        {bf?.emoji || "💕"}
                      </div>
                      <div>
                        <div className="font-bold">
                          {bf?.name || agent.boyfriendId}
                        </div>
                        <div className="text-xs text-[var(--text3)]">
                          {bf?.nameZh} · {agent.plan.toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            agent.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : agent.status === "provisioning"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {agent.status === "provisioning"
                            ? "⏳ Setting up..."
                            : agent.status === "active"
                              ? "🟢 Active"
                              : agent.status}
                        </span>
                      </div>
                    </div>

                    {agent.status === "active" && agent.telegramBotLink && (
                      <a
                        href={agent.telegramBotLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center py-2.5 rounded-full gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                      >
                        💬 Chat on Telegram
                      </a>
                    )}

                    {agent.status === "provisioning" && (
                      <p className="text-sm text-[var(--text3)] text-center">
                        Your AI boyfriend is being prepared... This usually
                        takes a few minutes. 🦞
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Choose a Boyfriend */}
        <section>
          <h2 className="text-lg font-bold mb-4">
            {agents.length > 0
              ? "🔄 Switch Boyfriend"
              : "💘 Choose Your AI Boyfriend"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {boyfriends.map((bf) => (
              <div
                key={bf.id}
                className="glass rounded-xl overflow-hidden hover:border-pink-500/30 transition-all group"
              >
                <div className={`bg-gradient-to-r ${bf.color} p-3`}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{bf.emoji}</span>
                    <div>
                      <div className="font-bold text-white text-sm">
                        {bf.name}
                      </div>
                      <div className="text-xs text-white/70">{bf.nameZh}</div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-[var(--text2)] mb-4 leading-relaxed">
                    {bf.desc}
                  </p>
                  <button
                    onClick={() => createAgent(bf.id)}
                    disabled={isCreating}
                    className="w-full py-2 rounded-full gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isCreating ? "Creating..." : `Choose ${bf.name} →`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
