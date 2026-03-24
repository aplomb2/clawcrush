import { db } from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { agentId, botToken } = await req.json();

  if (!agentId || !botToken) {
    return NextResponse.json({ error: "Missing agentId or botToken" }, { status: 400 });
  }

  // Validate token format
  if (!/^\d{8,}:[A-Za-z0-9_-]{30,}$/.test(botToken)) {
    return NextResponse.json({ error: "Invalid bot token format" }, { status: 400 });
  }

  // Check agent exists
  const agentDoc = await db.collection("agents").doc(agentId).get();
  if (!agentDoc.exists) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  // Check token not already in use
  const tokenInUse = await db
    .collection("agents")
    .where("telegramBotToken", "==", botToken)
    .where("status", "in", ["active", "provisioning"])
    .limit(1)
    .get();

  if (!tokenInUse.empty && tokenInUse.docs[0].id !== agentId) {
    return NextResponse.json({ error: "This bot token is already in use" }, { status: 409 });
  }

  // Verify with Telegram
  let botUsername = "";
  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const tgData = await tgRes.json();
    if (!tgData.ok) {
      return NextResponse.json({ error: "Telegram rejected this token — please check and try again" }, { status: 400 });
    }
    botUsername = tgData.result.username || "";
  } catch {
    return NextResponse.json({ error: "Could not verify with Telegram" }, { status: 500 });
  }

  // Update agent
  await db.collection("agents").doc(agentId).update({
    telegramBotToken: botToken,
    telegramBotUsername: botUsername,
    telegramBotLink: botUsername ? `https://t.me/${botUsername}` : "",
    needsBotToken: false,
    status: "provisioning", // ensure provision watcher picks it up
    tokenProvidedAt: new Date().toISOString(),
  });

  return NextResponse.json({
    success: true,
    botUsername,
    botLink: `https://t.me/${botUsername}`,
  });
}
