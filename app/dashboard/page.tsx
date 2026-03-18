"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
import { personas, femalePersonas, malePersonas } from "@/lib/personas";

interface Agent {
  agentId: string;
  boyfriendId: string;
  boyfriendName?: string;
  plan: string;
  status: string;
  telegramBotLink: string;
  createdAt: string;
  imageEnabled?: boolean;
  imageStyle?: string | null;
  imageQuota?: number;
  imageUsed?: number;
}

export default function DashboardPage() {
  const { user, loading, signInWithGoogle, signOut, getIdToken } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [userInfo, setUserInfo] = useState<{ isAdmin: boolean } | null>(null);
  const [error, setError] = useState("");
  const [genderTab, setGenderTab] = useState<"female" | "male">("female");
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<string>("");
  const [botToken, setBotToken] = useState("");
  const [botTokenError, setBotTokenError] = useState("");


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

  const trackedSignUp = useRef(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
      // Track sign-up / sign-in as conversion (fire once per session)
      if (!trackedSignUp.current) {
        trackedSignUp.current = true;
        window.gtag?.("event", "sign_up", {
          event_category: "conversion",
          method: "google",
        });
      }
    }
  }, [user, fetchUserData]);

  const startCreateAgent = (boyfriendId: string) => {
    setSelectedPersona(boyfriendId);
    setBotToken("");
    setBotTokenError("");
    setShowTokenModal(true);
  };

  const validateBotToken = (token: string) => {
    // Telegram bot tokens look like: 123456789:ABCDefGHIjklMNOpqrsTUVwxyz
    return /^\d{8,}:[A-Za-z0-9_-]{30,}$/.test(token.trim());
  };

  const createAgent = async () => {
    if (!botToken.trim()) {
      setBotTokenError("Please enter your Telegram bot token");
      return;
    }
    if (!validateBotToken(botToken)) {
      setBotTokenError("Invalid token format. It should look like: 123456789:ABCDefGHIjklMNO...");
      return;
    }

    setIsCreating(true);
    setError("");
    setBotTokenError("");

    const token = await getIdToken();
    if (!token) return;

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boyfriendId: selectedPersona,
          plan: "premium",
          telegramBotToken: botToken.trim(),
        }),
      });

      const data = await res.json();

      if (data.requirePayment) {
        const checkoutRes = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan: "premium",
            boyfriendId: selectedPersona,
          }),
        });
        const checkoutData = await checkoutRes.json();
        if (checkoutData.url) {
          // Track checkout initiation
          window.gtag?.("event", "begin_checkout", {
            event_category: "conversion",
            event_label: selectedPersona,
            value: 24.99,
            currency: "USD",
          });
          window.location.href = checkoutData.url;
        }
        return;
      }

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setShowTokenModal(false);
      // Track agent creation as primary conversion
      window.gtag?.("event", "agent_created", {
        event_category: "conversion",
        event_label: selectedPersona,
        value: 24.99,
        currency: "USD",
      });
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
            <Link href="/" className="hover:text-pink-400 transition-colors">
              ← Back to home
            </Link>
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
            <Link
              href="/"
              className="text-sm text-[var(--text3)] hover:text-white transition-colors"
            >
              Home
            </Link>
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
                const bf = personas.find((b) => b.id === agent.boyfriendId);
                return (
                  <div key={agent.agentId} className="glass rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-r ${bf?.color || "from-pink-500 to-rose-500"} flex items-center justify-center text-2xl overflow-hidden`}
                      >
                        {bf?.avatar ? (
                          <Image src={bf.avatar} alt={bf.name} width={48} height={48} className="w-full h-full object-cover" />
                        ) : (
                          bf?.emoji || "💕"
                        )}
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

                    {/* Image feature status */}
                    <div className="text-sm text-[var(--text3)] mb-3">
                      {agent.imageEnabled ? (
                        agent.imageStyle ? (
                          <span>📸 Images: {agent.imageUsed ?? 0}/{agent.imageQuota ?? 0} used</span>
                        ) : (
                          <span>📸 Start chatting to set up your character&apos;s look!</span>
                        )
                      ) : (
                        <span>📸 Images: Not available (upgrade to Premium)</span>
                      )}
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
                        Your AI companion is being prepared... This usually
                        takes 2-3 minutes. 🦞
                      </p>
                    )}

                    {agent.status === "suspended" && (
                      <div className="text-center">
                        <p className="text-sm text-red-400 mb-2">
                          ⏸️ Subscription expired. Resubscribe to reactivate.
                        </p>
                        <p className="text-xs text-[var(--text3)]">
                          Your memories are safe — they&apos;ll be here when you come back.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Choose a Companion */}
        <section>
          <h2 className="text-lg font-bold mb-4">
            {agents.length > 0
              ? "🔄 Choose Another Companion"
              : "💘 Choose Your AI Companion"}
          </h2>

          {/* Gender Tabs */}
          <div className="flex gap-2 mb-4">
            {[
              { key: "female", label: "👩 Girlfriends", list: femalePersonas },
              { key: "male", label: "👨 Boyfriends", list: malePersonas },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setGenderTab(tab.key as "female" | "male")}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  genderTab === tab.key
                    ? "gradient-bg text-white"
                    : "glass text-[var(--text3)] hover:text-white"
                }`}
              >
                {tab.label} ({tab.list.length})
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(genderTab === "female" ? femalePersonas : malePersonas).map((bf) => (
              <div
                key={bf.id}
                className="glass rounded-xl overflow-hidden hover:border-pink-500/30 transition-all group"
              >
                <div className={`bg-gradient-to-r ${bf.color} p-3`}>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
                      {bf.avatar ? (
                        <Image src={bf.avatar} alt={bf.name} width={40} height={40} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">{bf.emoji}</span>
                      )}
                    </div>
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
                    onClick={() => startCreateAgent(bf.id)}
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

        {/* Telegram Bot Token Modal */}
        {showTokenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="glass rounded-2xl p-6 max-w-lg w-full relative">
              <button
                onClick={() => setShowTokenModal(false)}
                className="absolute top-4 right-4 text-[var(--text3)] hover:text-white text-xl"
              >
                ✕
              </button>

              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🤖</div>
                <h3 className="text-xl font-bold">Set Up Your Telegram Bot</h3>
                <p className="text-sm text-[var(--text3)] mt-2">
                  Each companion needs their own Telegram bot. It takes 30 seconds!
                </p>
              </div>

              <div className="glass rounded-xl p-4 mb-6">
                <h4 className="font-bold text-sm mb-3">📋 Quick Setup (3 steps)</h4>
                <ol className="space-y-2 text-sm text-[var(--text2)]">
                  <li className="flex gap-2">
                    <span className="text-pink-400 font-bold shrink-0">1.</span>
                    <span>
                      Open Telegram and search for{" "}
                      <a
                        href="https://t.me/BotFather"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-400 hover:underline font-semibold"
                      >
                        @BotFather
                      </a>
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-pink-400 font-bold shrink-0">2.</span>
                    <span>
                      Send <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs">/newbot</code> → give it a name and username
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-pink-400 font-bold shrink-0">3.</span>
                    <span>Copy the <strong>bot token</strong> BotFather gives you and paste it below</span>
                  </li>
                </ol>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Telegram Bot Token</label>
                <input
                  type="text"
                  value={botToken}
                  onChange={(e) => { setBotToken(e.target.value); setBotTokenError(""); }}
                  placeholder="123456789:ABCDefGHIjklMNOpqrsTUVwxyz..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[var(--text3)] focus:outline-none focus:border-pink-500/50 font-mono"
                />
                {botTokenError && (
                  <p className="text-red-400 text-xs mt-1">{botTokenError}</p>
                )}
              </div>

              <button
                onClick={createAgent}
                disabled={isCreating || !botToken.trim()}
                className="w-full py-3 rounded-full gradient-bg text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isCreating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating your companion...
                  </span>
                ) : (
                  `Activate ${personas.find(p => p.id === selectedPersona)?.name || "Companion"} →`
                )}
              </button>

              <p className="text-xs text-[var(--text3)] mt-3 text-center">
                🔒 Your bot token is encrypted and only used to connect your companion.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
