// POST /api/agents — create a new AI boyfriend agent
// This is called from the dashboard when a user selects a boyfriend
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { db, ADMIN_EMAILS } from "@/lib/firebase-admin";
import { PLANS, PlanKey } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { boyfriendId, plan = "premium", telegramBotToken } = await req.json();

  if (!boyfriendId) {
    return NextResponse.json({ error: "boyfriendId required" }, { status: 400 });
  }

  if (!telegramBotToken || !/^\d{8,}:[A-Za-z0-9_-]{30,}$/.test(telegramBotToken.trim())) {
    return NextResponse.json({ error: "Valid Telegram bot token required" }, { status: 400 });
  }

  const isAdmin = ADMIN_EMAILS.includes(user.email);

  // Check whitelist
  const whitelistDoc = await db.collection("whitelist").doc(user.email.toLowerCase()).get();
  const isWhitelisted = whitelistDoc.exists;
  const bypassPayment = isAdmin || isWhitelisted;

  // Check if user already has an active agent
  const existing = await db
    .collection("agents")
    .where("userId", "==", user.uid)
    .where("status", "in", ["active", "provisioning"])
    .get();

  if (!existing.empty && !bypassPayment) {
    return NextResponse.json(
      { error: "You already have an active AI companion. Manage them from your dashboard." },
      { status: 409 }
    );
  }

  // If not admin/whitelisted, require payment first
  if (!bypassPayment) {
    // Check for active subscription in Firestore
    const subSnap = await db
      .collection("subscriptions")
      .where("userId", "==", user.uid)
      .where("status", "==", "active")
      .get();

    if (subSnap.empty) {
      // Redirect to checkout
      const selectedPlan = PLANS[plan as PlanKey] || PLANS.premium;
      return NextResponse.json(
        { error: "Payment required", requirePayment: true, plan, priceId: selectedPlan.priceId },
        { status: 402 }
      );
    }
  }

  // Check if bot token is already in use by another agent
  const tokenInUse = await db
    .collection("agents")
    .where("telegramBotToken", "==", telegramBotToken.trim())
    .where("status", "in", ["active", "provisioning"])
    .limit(1)
    .get();

  if (!tokenInUse.empty) {
    return NextResponse.json(
      { error: "This bot token is already in use by another companion." },
      { status: 409 }
    );
  }

  // Create agent record in Firestore
  const agentId = `clawcrush-${user.uid.slice(0, 8)}-${Date.now()}`;
  // Verify bot token with Telegram API
  let botUsername = "";
  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${telegramBotToken.trim()}/getMe`);
    const tgData = await tgRes.json();
    if (!tgData.ok) {
      return NextResponse.json({ error: "Invalid bot token — Telegram rejected it. Please check and try again." }, { status: 400 });
    }
    botUsername = tgData.result.username || "";
  } catch {
    return NextResponse.json({ error: "Could not verify bot token with Telegram. Please try again." }, { status: 500 });
  }

  const effectivePlan = bypassPayment ? "vip" : plan;
  const imageQuotaByPlan: Record<string, number> = { basic: 0, premium: 30, vip: 100 };
  const imageQuota = imageQuotaByPlan[effectivePlan] ?? 0;

  const agentData = {
    agentId,
    userId: user.uid,
    email: user.email,
    userName: user.name || "Anonymous",
    boyfriendId,
    plan: effectivePlan,
    status: "provisioning",
    telegramBotToken: telegramBotToken.trim(),
    telegramBotUsername: botUsername,
    telegramBotLink: botUsername ? `https://t.me/${botUsername}` : "",
    createdAt: new Date().toISOString(),
    isAdmin,
    imageEnabled: imageQuota > 0,
    imageStyle: null,
    imageQuota,
    imageUsed: 0,
  };

  await db.collection("agents").doc(agentId).set(agentData);

  // Send webhook to Angela (OpenClaw control hub) for agent provisioning
  try {
    const webhookUrl = process.env.OPENCLAW_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Webhook-Secret": process.env.WEBHOOK_SECRET || "",
        },
        body: JSON.stringify({
          type: "agent.create",
          data: agentData,
        }),
      });
    }
  } catch (e) {
    console.error("Webhook send failed:", e);
    // Don't fail the request — Angela can pick up from Firestore
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { telegramBotToken: _token, ...safeAgentData } = agentData;
  return NextResponse.json({
    success: true,
    agent: safeAgentData,
    message: "Your AI boyfriend is being prepared! You'll receive a Telegram link shortly.",
  });
}

// GET /api/agents — list current user's agents
export async function GET(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const agentsSnap = await db
    .collection("agents")
    .where("userId", "==", user.uid)
    .orderBy("createdAt", "desc")
    .get();

  const agents = agentsSnap.docs.map((doc) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { telegramBotToken, ...safe } = doc.data();
    return { id: doc.id, ...safe };
  });

  return NextResponse.json({ agents });
}
