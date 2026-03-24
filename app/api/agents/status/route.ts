import { db } from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  // Try finding by stripeSessionId first
  let snap = await db
    .collection("agents")
    .where("stripeSessionId", "==", sessionId)
    .limit(1)
    .get();

  // Fallback: check Stripe session to get userId, then find agent by userId
  if (snap.empty) {
    try {
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (stripeKey) {
        const stripeRes = await fetch(
          `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
          { headers: { Authorization: `Bearer ${stripeKey}` } }
        );
        if (stripeRes.ok) {
          const stripeSession = await stripeRes.json();
          const userId = stripeSession.metadata?.userId;
          if (userId) {
            snap = await db
              .collection("agents")
              .where("userId", "==", userId)
              .where("status", "in", ["provisioning", "active"])
              .orderBy("createdAt", "desc")
              .limit(1)
              .get();
          }
        }
      }
    } catch (e) {
      console.error("Stripe session lookup failed:", e);
    }
  }

  if (snap.empty) {
    return NextResponse.json({
      status: "provisioning",
      botUsername: null,
      characterName: null,
      persona: null,
      needsBotToken: false,
    });
  }

  const agent = snap.docs[0].data();
  return NextResponse.json({
    status: agent.status || "provisioning",
    botUsername: agent.telegramBotUsername || null,
    botLink: agent.telegramBotLink || null,
    characterName: agent.characterName || null,
    persona: agent.boyfriendId || null,
    needsBotToken: agent.needsBotToken || !agent.telegramBotToken,
    agentId: agent.agentId || null,
  });
}
