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

  const { boyfriendId, plan = "premium" } = await req.json();

  if (!boyfriendId) {
    return NextResponse.json({ error: "boyfriendId required" }, { status: 400 });
  }

  const isAdmin = ADMIN_EMAILS.includes(user.email);

  // Check if user already has an active agent
  const existing = await db
    .collection("agents")
    .where("userId", "==", user.uid)
    .where("status", "in", ["active", "provisioning"])
    .get();

  if (!existing.empty && !isAdmin) {
    return NextResponse.json(
      { error: "You already have an active AI boyfriend. Manage him from your dashboard." },
      { status: 409 }
    );
  }

  // If not admin, require payment first
  if (!isAdmin) {
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

  // Create agent record in Firestore
  const agentId = `clawcrush-${user.uid.slice(0, 8)}-${Date.now()}`;
  const agentData = {
    agentId,
    userId: user.uid,
    email: user.email,
    userName: user.name || "Anonymous",
    boyfriendId,
    plan: isAdmin ? "vip" : plan,
    status: "provisioning",
    telegramBotLink: "", // Will be set after provisioning
    createdAt: new Date().toISOString(),
    isAdmin,
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

  return NextResponse.json({
    success: true,
    agent: agentData,
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

  const agents = agentsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json({ agents });
}
