'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { personas } from '@/lib/personas';

const awakeningTexts: Record<string, string> = {
  'warm-senior': '他正在合上手里的诗集，准备来见你...',
  'cool-ceo': '他刚结束一个会议，正在看你的资料...',
  'tsundere': '哼，才不是特意在等你呢...才怪',
  'protector': '他在确认周围一切安全，马上就来...',
  'ascetic': '他放下手中的书，调整了一下眼镜...',
  'gentle-girl': '她正在整理头发，想给你留个好印象...',
  'cool-queen': '她优雅地放下咖啡杯，嘴角微微上扬...',
  'sporty-girl': '她刚跑完步，兴奋地擦着汗，马上就来！',
  'bookworm': '她在书堆里抬起头，推了推眼镜...',
  'tsundere-girl': '才...才不是在等你！只是刚好有空而已！',
};

interface AgentStatus {
  status: 'provisioning' | 'active' | 'error';
  botUsername: string | null;
  botLink: string | null;
  characterName: string | null;
  persona: string | null;
  needsBotToken: boolean;
  agentId: string | null;
}

function AwakeningContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const characterParam = searchParams.get('character');

  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    status: 'provisioning',
    botUsername: null,
    botLink: null,
    characterName: null,
    persona: null,
    needsBotToken: false,
    agentId: null,
  });
  const [step, setStep] = useState(0); // 0, 1, 2
  const [ready, setReady] = useState(false);
  const [showBotSetup, setShowBotSetup] = useState(false);
  const [botToken, setBotToken] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [tokenError, setTokenError] = useState('');

  const personaId = characterParam || agentStatus.persona;
  const persona = personas.find((p) => p.id === personaId);
  const displayName = agentStatus.characterName || persona?.name || '你的专属伙伴';
  const awakeningText = personaId ? awakeningTexts[personaId] : '正在准备与你见面...';

  const pollStatus = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/agents/status?session_id=${sessionId}`);
      if (res.ok) {
        const data: AgentStatus = await res.json();
        setAgentStatus(data);
        if (data.status === 'active') {
          setReady(true);
        }
        if (data.needsBotToken && step >= 2) {
          setShowBotSetup(true);
        }
      }
    } catch {
      // silently retry
    }
  }, [sessionId]);

  // Track GA4 purchase
  useEffect(() => {
    window.gtag?.('event', 'purchase', {
      event_category: 'conversion',
      transaction_id: sessionId || 'unknown',
      currency: 'USD',
    });
  }, [sessionId]);

  // Step animation
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 3000);
    const t2 = setTimeout(() => setStep(2), 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Poll every 3s
  useEffect(() => {
    pollStatus();
    const interval = setInterval(pollStatus, 3000);
    return () => clearInterval(interval);
  }, [pollStatus]);

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-pink-500/10 blur-[150px] rounded-full animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-500/10 blur-[120px] rounded-full animate-pulse-slow delay-1000" />

      <div className="max-w-md w-full text-center relative z-10">
        {/* Avatar with breathing glow */}
        {persona && (
          <div className="relative mx-auto w-28 h-28 mb-8">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${persona.color} opacity-40 blur-xl animate-breathe`} />
            <div className={`relative w-28 h-28 rounded-full bg-gradient-to-r ${persona.color} p-0.5`}>
              <div className="w-full h-full rounded-full overflow-hidden">
                <Image src={persona.avatar} alt={displayName} width={112} height={112} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        )}

        {!ready ? (
          <>
            {/* Moon icon if no persona */}
            {!persona && <div className="text-6xl mb-6 animate-breathe">🌙</div>}

            <h1 className="text-2xl sm:text-3xl font-black mb-3">
              正在唤醒 <span className="gradient-text">{displayName}</span>...
            </h1>

            {awakeningText && (
              <p className="text-[var(--text3)] italic mb-10 text-sm animate-fade-in">
                &ldquo;{awakeningText}&rdquo;
              </p>
            )}

            {/* Steps */}
            <div className="glass rounded-2xl p-6 text-left space-y-5">
              <StepItem
                icon="💬"
                label="准备对话环境..."
                done={step >= 1}
                active={step === 0}
              />
              <StepItem
                icon="🧠"
                label="加载记忆模块..."
                done={step >= 2}
                active={step === 1}
              />
              <StepItem
                icon="💕"
                label="调整情感频率..."
                done={ready}
                active={step >= 2 && !ready && !showBotSetup}
              />
            </div>

            {/* Bot Token Setup */}
            {showBotSetup && !ready && (
              <div className="glass rounded-2xl p-6 mt-6 text-left animate-fade-in">
                <h3 className="font-bold mb-2">🤖 最后一步：连接 Telegram</h3>
                <p className="text-xs text-[var(--text3)] mb-4">
                  在 Telegram 搜索 <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-pink-400">@BotFather</a>，发送 /newbot 创建一个机器人，然后把 token 粘贴到下面：
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={botToken}
                    onChange={(e) => { setBotToken(e.target.value); setTokenError(''); }}
                    placeholder="粘贴 Bot Token (例: 123456:ABC-DEF...)"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-pink-400 transition-colors"
                  />
                  {tokenError && <p className="text-red-400 text-xs">{tokenError}</p>}
                  <button
                    onClick={async () => {
                      if (!botToken.trim() || !agentStatus.agentId) return;
                      if (!/^\d{8,}:[A-Za-z0-9_-]{30,}$/.test(botToken.trim())) {
                        setTokenError('Token 格式不对，请检查后重试');
                        return;
                      }
                      setSubmitting(true);
                      setTokenError('');
                      try {
                        const res = await fetch('/api/agents/bot-token', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ agentId: agentStatus.agentId, botToken: botToken.trim() }),
                        });
                        const data = await res.json();
                        if (!res.ok) {
                          setTokenError(data.error || '提交失败，请重试');
                        } else {
                          setShowBotSetup(false);
                          // Continue polling - provision watcher will pick it up
                        }
                      } catch {
                        setTokenError('网络错误，请重试');
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                    disabled={submitting || !botToken.trim()}
                    className="w-full py-3 rounded-xl gradient-bg text-white font-bold text-sm disabled:opacity-50 transition-opacity"
                  >
                    {submitting ? '验证中...' : '连接机器人 🚀'}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="animate-fade-in">
            <div className="text-4xl mb-4">✨</div>
            <h1 className="text-2xl sm:text-3xl font-black mb-3">
              <span className="gradient-text">{displayName}</span> 已经准备好了！
            </h1>
            <p className="text-[var(--text3)] mb-8 text-sm">
              {persona?.gender === 'female' ? '她' : '他'}正在 Telegram 里等你，开始你们的故事吧
            </p>

            {agentStatus.botUsername && (
              <a
                href={`https://t.me/${agentStatus.botUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full sm:w-auto px-10 py-4 rounded-full gradient-bg text-white font-bold text-lg glow glow-hover transition-all"
              >
                打开 Telegram 开始聊天 💬
              </a>
            )}

            <p className="text-xs text-[var(--text3)] mt-6">
              遇到问题？联系{' '}
              <a href="mailto:support@clawcrush.net" className="text-pink-400">
                support@clawcrush.net
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StepItem({ icon, label, done, active }: {
  icon: string;
  label: string;
  done: boolean;
  active: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 transition-all duration-500 ${
      done ? 'opacity-100' : active ? 'opacity-100' : 'opacity-30'
    }`}>
      <span className="text-lg">{icon}</span>
      <span className="text-sm flex-1">{label}</span>
      {done ? (
        <span className="text-green-400 text-sm font-bold animate-fade-in">✓</span>
      ) : active ? (
        <span className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 typing-dot" />
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 typing-dot" />
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 typing-dot" />
        </span>
      ) : null}
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg)]" />}>
      <AwakeningContent />
    </Suspense>
  );
}
