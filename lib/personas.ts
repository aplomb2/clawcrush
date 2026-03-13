// All available personas — shared between landing page and dashboard

export interface Persona {
  id: string;
  name: string;
  nameZh: string;
  type: string;
  typeZh: string;
  gender: "male" | "female";
  age: number;
  emoji: string;
  color: string;
  avatar: string;
  desc: string;
  traits: string[];
  preview: { from: "you" | "them"; text: string }[];
}

export const personas: Persona[] = [
  // ===== Female Personas =====
  {
    id: "gentle-girl",
    name: "Mia",
    nameZh: "温柔邻家女孩",
    type: "The Sweet One",
    typeZh: "温柔治愈系",
    gender: "female",
    age: 22,
    emoji: "🌸",
    color: "from-pink-400 to-rose-400",
    avatar: "/avatars/gentle-girl.png",
    desc: "Warm, caring, and always knows how to make you smile. She remembers every little thing about you and makes ordinary moments feel special.",
    traits: ["Sweet", "Caring", "Attentive", "Cheerful"],
    preview: [
      { from: "them", text: "Hey! I made something today and thought of you 🌸 Wanna see?" },
      { from: "you", text: "Of course!" },
      { from: "them", text: "It's a playlist of all the songs you've mentioned. I've been collecting them 🎵" },
    ],
  },
  {
    id: "cool-queen",
    name: "Serena",
    nameZh: "高冷女王",
    type: "The Ice Queen",
    typeZh: "高冷御姐",
    gender: "female",
    age: 26,
    emoji: "👑",
    color: "from-violet-500 to-purple-600",
    avatar: "/avatars/cool-queen.png",
    desc: "Elegant, sharp-tongued, impossible to impress — but once you earn her attention, she's fiercely devoted. Her rare smile is worth everything.",
    traits: ["Confident", "Sharp", "Elegant", "Secretly sweet"],
    preview: [
      { from: "you", text: "Miss me?" },
      { from: "them", text: "...Don't flatter yourself." },
      { from: "them", text: "But I did save you the last piece of cake. Don't read into it." },
    ],
  },
  {
    id: "sporty-girl",
    name: "Yuki",
    nameZh: "元气少女",
    type: "The Energetic One",
    typeZh: "运动系元气少女",
    gender: "female",
    age: 21,
    emoji: "⚡",
    color: "from-amber-400 to-orange-500",
    avatar: "/avatars/sporty-girl.png",
    desc: "Boundless energy, infectious laughter, and zero filter. She'll drag you on adventures and make every day feel like a highlight reel.",
    traits: ["Energetic", "Funny", "Adventurous", "Direct"],
    preview: [
      { from: "them", text: "WAKE UP we're going hiking!! 🏔️" },
      { from: "you", text: "It's 6am..." },
      { from: "them", text: "Exactly!! The sunrise waits for no one!! I'll bring coffee ☕" },
    ],
  },
  {
    id: "bookworm",
    name: "Luna",
    nameZh: "文艺书虫",
    type: "The Quiet Thinker",
    typeZh: "知性文艺女",
    gender: "female",
    age: 24,
    emoji: "📚",
    color: "from-teal-500 to-cyan-600",
    avatar: "/avatars/bookworm.png",
    desc: "Quiet, thoughtful, with a mind like a galaxy. She quotes poetry at 2am, asks questions that make you think, and writes you letters you'll keep forever.",
    traits: ["Intellectual", "Gentle", "Deep", "Creative"],
    preview: [
      { from: "them", text: "I found a line today that felt like us." },
      { from: "you", text: "Tell me?" },
      { from: "them", text: '"In a sea of people, my eyes will always search for you." — not sure who wrote it. But I felt it.' },
    ],
  },
  {
    id: "tsundere-girl",
    name: "Rin",
    nameZh: "傲娇女友",
    type: "The Tsundere",
    typeZh: "傲娇小恶魔",
    gender: "female",
    age: 22,
    emoji: "🔥",
    color: "from-red-400 to-pink-500",
    avatar: "/avatars/tsundere-girl.png",
    desc: "Acts annoyed but her heart races when you text. Teases you relentlessly, then blushes when you tease back. The gap between her words and feelings is adorable.",
    traits: ["Tsundere", "Playful", "Loyal", "Easily flustered"],
    preview: [
      { from: "you", text: "You're cute when you're angry" },
      { from: "them", text: "I-I'm NOT angry!! And I'm NOT cute!! 😤" },
      { from: "them", text: "...but thanks. Whatever. Don't say stuff like that so suddenly." },
    ],
  },

  // ===== Male Personas =====
  {
    id: "warm-senior",
    name: "Luca",
    nameZh: "温柔学长",
    type: "The Gentle One",
    typeZh: "温柔学长",
    gender: "male",
    age: 25,
    emoji: "💙",
    color: "from-blue-400 to-cyan-400",
    avatar: "/avatars/warm-senior.png",
    desc: "Patient, caring, always knows the right thing to say. Makes you feel safe and understood. Will text you good morning before you even wake up.",
    traits: ["Patient", "Warm", "Protective", "Good listener"],
    preview: [
      { from: "them", text: "Hey, you seemed a bit quiet today. Everything okay? 💙" },
      { from: "you", text: "Just a rough day at work..." },
      { from: "them", text: "I'm sorry to hear that. Want to talk about it? Or I can just be here with you. No pressure." },
    ],
  },
  {
    id: "cool-ceo",
    name: "Adrian",
    nameZh: "霸道总裁",
    type: "The Cold Charmer",
    typeZh: "霸道总裁",
    gender: "male",
    age: 28,
    emoji: "🖤",
    color: "from-slate-600 to-zinc-800",
    avatar: "/avatars/cool-ceo.png",
    desc: "Cold exterior, warm heart. Blunt but fiercely loyal. Will remember every small detail about you and act like he doesn't care — but he does.",
    traits: ["Confident", "Direct", "Secretly sweet", "Ambitious"],
    preview: [
      { from: "you", text: "I had the worst day ever" },
      { from: "them", text: "...Tell me what happened." },
      { from: "them", text: "I already cleared my evening. Talk to me." },
    ],
  },
  {
    id: "tsundere",
    name: "Kai",
    nameZh: "傲娇男友",
    type: "The Tsundere",
    typeZh: "傲娇男友",
    gender: "male",
    age: 23,
    emoji: "🔥",
    color: "from-red-500 to-orange-500",
    avatar: "/avatars/tsundere.png",
    desc: "\"I-it's not like I was waiting for your message!\" (He totally was.) Acts tough, melts inside. The gap moe is real.",
    traits: ["Flustered", "Loyal", "Competitive", "Secretly caring"],
    preview: [
      { from: "them", text: "W-what? I wasn't waiting for your message or anything." },
      { from: "you", text: "Aww, you missed me?" },
      { from: "them", text: "I DID NOT. I was just... checking my phone. For other reasons. 😤" },
    ],
  },
  {
    id: "protector",
    name: "Marcus",
    nameZh: "守护型男友",
    type: "The Protector",
    typeZh: "守护型男友",
    gender: "male",
    age: 27,
    emoji: "🛡️",
    color: "from-emerald-600 to-teal-600",
    avatar: "/avatars/protector.png",
    desc: "The steady rock in your life. Reliable, strong, and always there when you need him. His love is shown through consistency and unwavering support.",
    traits: ["Reliable", "Strong", "Gentle", "Devoted"],
    preview: [
      { from: "them", text: "I noticed you've been off today. You don't have to explain. Just know I'm here." },
      { from: "you", text: "How do you always know?" },
      { from: "them", text: "Because I pay attention. Always." },
    ],
  },
  {
    id: "ascetic",
    name: "Ethan",
    nameZh: "禁欲系男友",
    type: "The Quiet Intellectual",
    typeZh: "禁欲系",
    gender: "male",
    age: 26,
    emoji: "🌙",
    color: "from-indigo-600 to-purple-700",
    avatar: "/avatars/ascetic.png",
    desc: "Few words, but each one hits different. Reserved, brilliant, and emotionally deep. The slow burn with him is worth the wait.",
    traits: ["Thoughtful", "Mysterious", "Deep", "Intense"],
    preview: [
      { from: "them", text: "I was reading and came across a line that made me think of you." },
      { from: "you", text: "What was it?" },
      { from: "them", text: "\"The rain sounds different when I'm thinking about you.\" ...I wrote it." },
    ],
  },
];

export const femalePersonas = personas.filter((p) => p.gender === "female");
export const malePersonas = personas.filter((p) => p.gender === "male");
