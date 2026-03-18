// Shared types
// Note: Persona interface is defined in lib/personas.ts (single source of truth)

export interface UserAgent {
  agentId: string;
  userId: string;
  email: string;
  boyfriendId: string;
  plan: "basic" | "premium" | "vip";
  status: "active" | "provisioning" | "suspended" | "cancelled" | "error";
  telegramBotToken: string;
  telegramBotUsername: string;
  telegramBotLink: string;
  createdAt: string;
  isAdmin: boolean;
  imageEnabled: boolean;
  imageStyle: "anime" | "realistic" | null;
  imageQuota: number;
  imageUsed: number;
  characterLocked?: boolean;
}

export type AgentCommand =
  | { type: "create"; boyfriendId: string; plan: string; userId: string; email: string }
  | { type: "suspend"; agentId: string }
  | { type: "resume"; agentId: string }
  | { type: "delete"; agentId: string }
  | { type: "change-persona"; agentId: string; newBoyfriendId: string };
