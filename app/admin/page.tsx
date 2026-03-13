"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useCallback } from "react";

interface WhitelistEntry {
  id: string;
  email: string;
  note: string;
  addedBy: string;
  addedAt: string;
}

interface AgentEntry {
  id: string;
  agentId: string;
  email: string;
  userName: string;
  boyfriendId: string;
  plan: string;
  status: string;
  createdAt: string;
  telegramBotLink: string;
}

const ADMIN_EMAILS = ["simple.shen@gmail.com"];

export default function AdminPage() {
  const { user, loading, signInWithGoogle, getIdToken } = useAuth();
  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([]);
  const [agents, setAgents] = useState<AgentEntry[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newNote, setNewNote] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"whitelist" | "agents">("whitelist");

  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

  const fetchData = useCallback(async () => {
    const token = await getIdToken();
    if (!token) return;

    const [wlRes, agRes] = await Promise.all([
      fetch("/api/admin/whitelist", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("/api/admin/agents", { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    if (wlRes.ok) {
      const data = await wlRes.json();
      setWhitelist(data.whitelist);
    }
    if (agRes.ok) {
      const data = await agRes.json();
      setAgents(data.agents);
    }
  }, [getIdToken]);

  useEffect(() => {
    if (user && isAdmin) fetchData();
  }, [user, isAdmin, fetchData]);

  const addToWhitelist = async () => {
    if (!newEmail.trim()) return;
    const token = await getIdToken();
    if (!token) return;

    const res = await fetch("/api/admin/whitelist", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail.trim(), note: newNote.trim() }),
    });

    if (res.ok) {
      setMessage(`✅ Added ${newEmail} to whitelist`);
      setNewEmail("");
      setNewNote("");
      fetchData();
    } else {
      setMessage("❌ Failed to add");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const removeFromWhitelist = async (email: string) => {
    const token = await getIdToken();
    if (!token) return;

    await fetch("/api/admin/whitelist", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    fetchData();
  };

  if (!loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">🔐 Admin</h1>
          <button onClick={signInWithGoogle} className="py-3 px-6 rounded-full gradient-bg text-white font-semibold">
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[var(--text3)]">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">🚫 Access Denied</h1>
          <p className="text-[var(--text3)]">Admin access only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">🔐 Admin Panel</h1>
            <p className="text-sm text-[var(--text3)]">
              {agents.length} agents · {whitelist.length} whitelisted
            </p>
          </div>
          <a href="/dashboard" className="text-sm text-[var(--text3)] hover:text-white">← Dashboard</a>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["whitelist", "agents"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab ? "gradient-bg text-white" : "glass text-[var(--text3)] hover:text-white"
              }`}
            >
              {tab === "whitelist" ? "📋 Whitelist" : "🤖 Agents"}
            </button>
          ))}
        </div>

        {/* Whitelist Tab */}
        {activeTab === "whitelist" && (
          <div>
            <div className="glass rounded-xl p-5 mb-6">
              <h3 className="font-bold mb-3">Add to Whitelist</h3>
              <p className="text-xs text-[var(--text3)] mb-3">
                Whitelisted users can create AI companions without paying.
              </p>
              <div className="flex gap-2 mb-2">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="flex-1 px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm focus:border-pink-500/50 outline-none"
                />
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Note (optional)"
                  className="w-40 px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm focus:border-pink-500/50 outline-none"
                />
                <button
                  onClick={addToWhitelist}
                  className="px-4 py-2 rounded-lg gradient-bg text-white text-sm font-semibold hover:opacity-90"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {whitelist.map((entry) => (
                <div key={entry.id} className="glass rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{entry.email}</div>
                    <div className="text-xs text-[var(--text3)]">
                      {entry.note && `${entry.note} · `}
                      Added {new Date(entry.addedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromWhitelist(entry.email)}
                    className="text-xs px-3 py-1 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {whitelist.length === 0 && (
                <p className="text-sm text-[var(--text3)] text-center py-8">No whitelisted users yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === "agents" && (
          <div className="space-y-3">
            {agents.map((agent) => (
              <div key={agent.id} className="glass rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">
                      {agent.boyfriendId} · {agent.email}
                    </div>
                    <div className="text-xs text-[var(--text3)]">
                      {agent.agentId} · {agent.plan.toUpperCase()} · Created{" "}
                      {new Date(agent.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      agent.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : agent.status === "provisioning"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>
                {agent.telegramBotLink && (
                  <a
                    href={agent.telegramBotLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-pink-400 hover:underline mt-1 block"
                  >
                    {agent.telegramBotLink}
                  </a>
                )}
              </div>
            ))}
            {agents.length === 0 && (
              <p className="text-sm text-[var(--text3)] text-center py-8">No agents yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
