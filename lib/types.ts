// Shared types

export interface Boyfriend {
  id: string;
  name: string;
  nameZh: string;
  type: string;
  typeZh: string;
  age: number;
  emoji: string;
  color: string; // gradient class
  desc: string;
  traits: string[];
  preview: { from: "you" | "him"; text: string }[];
}

export interface UserAgent {
  agentId: string;
  userId: string;
  email: string;
  boyfriendId: string;
  boyfriendName: string;
  plan: "basic" | "premium" | "vip";
  status: "active" | "provisioning" | "suspended" | "cancelled";
  telegramBotLink: string;
  createdAt: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export type AgentCommand =
  | { type: "create"; boyfriendId: string; plan: string; userId: string; email: string }
  | { type: "suspend"; agentId: string }
  | { type: "resume"; agentId: string }
  | { type: "delete"; agentId: string }
  | { type: "change-persona"; agentId: string; newBoyfriendId: string };
