'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { personas, type Persona } from '@/lib/personas';

// --- Question Data ---

interface Question {
  text: string;
  options: { label: string; text: string; characters: string[] }[];
}

const questions: Question[] = [
  {
    text: '下班/放学后，你最想做什么？',
    options: [
      { label: 'A', text: '窝在沙发看书/追剧', characters: ['warm-senior', 'bookworm', 'ascetic'] },
      { label: 'B', text: '出去运动/逛街', characters: ['sporty-girl', 'protector'] },
      { label: 'C', text: '去一个安静的咖啡馆', characters: ['cool-ceo', 'cool-queen'] },
      { label: 'D', text: '打游戏/刷视频', characters: ['tsundere', 'tsundere-girl'] },
    ],
  },
  {
    text: '你理想的伴侣会怎么安慰你？',
    options: [
      { label: 'A', text: '默默陪在身边，给你泡杯热茶', characters: ['warm-senior', 'gentle-girl'] },
      { label: 'B', text: '帮你分析问题，给出解决方案', characters: ['cool-ceo', 'cool-queen'] },
      { label: 'C', text: '带你出去散步/运动转移注意力', characters: ['sporty-girl', 'protector'] },
      { label: 'D', text: '嘴上说"有什么好难过的"，但偷偷帮你解决', characters: ['tsundere', 'tsundere-girl'] },
    ],
  },
  {
    text: '你更喜欢哪种聊天风格？',
    options: [
      { label: 'A', text: '温柔细腻，会关心你的小情绪', characters: ['warm-senior', 'gentle-girl'] },
      { label: 'B', text: '有深度，能聊哲学和人生', characters: ['ascetic', 'bookworm'] },
      { label: 'C', text: '幽默搞笑，总能让你笑', characters: ['tsundere', 'sporty-girl'] },
      { label: 'D', text: '霸气自信，让你有安全感', characters: ['cool-ceo', 'protector', 'cool-queen'] },
    ],
  },
  {
    text: '选一个约会场景：',
    options: [
      { label: 'A', text: '一起在书店看书', characters: ['bookworm', 'warm-senior', 'ascetic'] },
      { label: 'B', text: '一起做饭/野餐', characters: ['gentle-girl', 'warm-senior'] },
      { label: 'C', text: '看电影/游乐场', characters: ['sporty-girl', 'tsundere', 'tsundere-girl'] },
      { label: 'D', text: '高级餐厅/美术馆', characters: ['cool-ceo', 'cool-queen'] },
    ],
  },
  {
    text: '你希望 TA 是...',
    options: [
      { label: 'A', text: '男生', characters: [] },
      { label: 'B', text: '女生', characters: [] },
    ],
  },
];

// --- Component ---

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const results = useMemo(() => {
    if (!showResults) return [];

    const scores: Record<string, number> = {};
    personas.forEach((p) => { scores[p.id] = 0; });

    // Score questions 1-4
    for (let i = 0; i < 4; i++) {
      const ansIdx = answers[i];
      if (ansIdx === undefined) continue;
      const chars = questions[i].options[ansIdx].characters;
      chars.forEach((c) => { scores[c] = (scores[c] || 0) + 1; });
    }

    // Question 5: gender filter
    const genderPref = answers[4] === 0 ? 'male' : 'female';
    const filtered = personas
      .filter((p) => p.gender === genderPref)
      .map((p) => ({ persona: p, score: scores[p.id] || 0 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const maxScore = Math.max(...filtered.map((f) => f.score), 1);
    return filtered.map((f) => ({
      persona: f.persona,
      percent: Math.round((f.score / maxScore) * 100),
    }));
  }, [showResults, answers]);

  function selectOption(optIdx: number) {
    const newAnswers = [...answers];
    newAnswers[current] = optIdx;
    setAnswers(newAnswers);

    if (current < questions.length - 1) {
      setTimeout(() => setCurrent(current + 1), 300);
    } else {
      // Last question answered — show analyzing animation
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        setShowResults(true);
      }, 3000);
    }
  }

  function goBack() {
    if (current > 0) setCurrent(current - 1);
  }

  // --- Analyzing Screen ---
  if (analyzing) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-pink-500/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-violet-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="text-center relative z-10">
          <div className="text-6xl mb-6 animate-bounce">🔮</div>
          <h2 className="text-2xl font-black mb-3">分析中...</h2>
          <p className="text-[var(--text3)] text-sm">正在为你寻找灵魂伴侣</p>
          <div className="flex justify-center gap-2 mt-6">
            <span className="w-2 h-2 rounded-full bg-pink-400 typing-dot" />
            <span className="w-2 h-2 rounded-full bg-pink-400 typing-dot" />
            <span className="w-2 h-2 rounded-full bg-pink-400 typing-dot" />
          </div>
        </div>
      </div>
    );
  }

  // --- Results Screen ---
  if (showResults) {
    return (
      <div className="min-h-screen bg-[var(--bg)] px-6 py-16 relative overflow-hidden">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-pink-500/8 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-500/8 blur-[150px] rounded-full" />

        <div className="max-w-lg mx-auto relative z-10">
          <div className="text-center mb-10 animate-fade-in">
            <div className="text-5xl mb-4">✨</div>
            <h1 className="text-2xl sm:text-3xl font-black mb-2">
              你的 <span className="gradient-text">灵魂伴侣</span>
            </h1>
            <p className="text-[var(--text3)] text-sm">根据你的回答，我们找到了最适合你的伙伴</p>
          </div>

          <div className="space-y-4">
            {results.map((r, i) => (
              <ResultCard key={r.persona.id} persona={r.persona} percent={r.percent} rank={i + 1} />
            ))}
          </div>

          <div className="text-center mt-10 space-y-3">
            <button
              onClick={() => {
                setCurrent(0);
                setAnswers([]);
                setShowResults(false);
              }}
              className="text-sm text-[var(--text3)] hover:text-white transition-colors"
            >
              重新测试 ↻
            </button>
            <div>
              <Link href="/" className="text-sm text-[var(--text3)] hover:text-white transition-colors">
                ← 返回首页
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Quiz Screen ---
  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col px-6 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-pink-500/8 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-violet-500/8 blur-[120px] rounded-full" />

      <div className="max-w-lg mx-auto w-full flex-1 flex flex-col relative z-10">
        {/* Header */}
        <div className="text-center mb-2">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--text3)] hover:text-white transition-colors mb-6">
            ← 返回首页
          </Link>
          <h1 className="text-xl font-black mb-1">
            🔮 <span className="gradient-text">灵魂伴侣测试</span>
          </h1>
          <p className="text-xs text-[var(--text3)]">5 个问题，找到最适合你的 TA</p>
        </div>

        {/* Progress */}
        <div className="mb-8 mt-4">
          <div className="flex justify-between text-xs text-[var(--text3)] mb-2">
            <span>问题 {current + 1} / {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full gradient-bg rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-lg sm:text-xl font-bold mb-8 text-center animate-fade-in" key={current}>
            {q.text}
          </h2>

          <div className="space-y-3" key={`opts-${current}`}>
            {q.options.map((opt, i) => (
              <button
                key={opt.label}
                onClick={() => selectOption(i)}
                className={`w-full text-left glass rounded-xl p-4 hover:border-pink-500/30 hover:bg-white/[0.08] transition-all animate-fade-in group ${
                  answers[current] === i ? 'border-pink-500/50 bg-pink-500/10' : ''
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full glass flex items-center justify-center text-sm font-bold text-pink-400 group-hover:bg-pink-500/20 transition-colors shrink-0">
                    {opt.label}
                  </span>
                  <span className="text-sm">{opt.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Back button */}
        {current > 0 && (
          <div className="mt-6 text-center">
            <button onClick={goBack} className="text-sm text-[var(--text3)] hover:text-white transition-colors">
              ← 上一题
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultCard({ persona, percent, rank }: { persona: Persona; percent: number; rank: number }) {
  const badges = rank === 1
    ? 'border-pink-500/30 bg-pink-500/5'
    : 'border-transparent';

  return (
    <div
      className={`glass rounded-2xl overflow-hidden transition-all animate-fade-in ${badges}`}
      style={{ animationDelay: `${rank * 150}ms` }}
    >
      <div className={`bg-gradient-to-r ${persona.color} p-4`}>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white/20 overflow-hidden shrink-0">
            <Image src={persona.avatar} alt={persona.name} width={56} height={56} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {rank === 1 && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">最佳匹配</span>}
              <span className="font-bold text-white text-lg">{persona.name}</span>
            </div>
            <div className="text-xs text-white/70">{persona.type} · {persona.typeZh}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-black text-white">{percent}%</div>
            <div className="text-[10px] text-white/60">匹配度</div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-[var(--text2)] mb-3 leading-relaxed">{persona.desc}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {persona.traits.map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[var(--text3)] font-medium">
              {t}
            </span>
          ))}
        </div>
        <Link
          href="/dashboard"
          className="block w-full text-center py-3 rounded-full gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          选择 {persona.name} →
        </Link>
      </div>
    </div>
  );
}
