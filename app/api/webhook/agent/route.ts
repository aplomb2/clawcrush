// POST /api/webhook/agent — receives commands from OpenClaw Gateway (Angela)
// Updates agent status in Firestore based on provisioning results
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  // Verify webhook secret
  const secret = req.headers.get("X-Webhook-Secret");
  if (!secret || secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { type, agentId, data } = body;

  if (!agentId) {
    return NextResponse.json({ error: "agentId required" }, { status: 400 });
  }

  switch (type) {
    case "agent.provisioned": {
      // Agent successfully created and started
      await db.collection("agents").doc(agentId).update({
        status: "active",
        telegramBotLink: data.telegramBotLink || "",
        provisionedAt: new Date().toISOString(),
        gatewayHost: data.gatewayHost || "macmini-1",
        model: data.model || "openai/gpt-4o",
      });
      return NextResponse.json({ success: true });
    }

    case "agent.suspended": {
      await db.collection("agents").doc(agentId).update({
        status: "suspended",
        suspendedAt: new Date().toISOString(),
        suspendReason: data.reason || "unknown",
      });
      return NextResponse.json({ success: true });
    }

    case "agent.deleted": {
      await db.collection("agents").doc(agentId).update({
        status: "cancelled",
        deletedAt: new Date().toISOString(),
      });
      return NextResponse.json({ success: true });
    }

    case "agent.error": {
      await db.collection("agents").doc(agentId).update({
        status: "error",
        error: data.error || "Unknown error",
        errorAt: new Date().toISOString(),
      });
      return NextResponse.json({ success: true });
    }

    case "image_style_set": {
      const style = data.style;
      if (!style || !["anime", "realistic"].includes(style)) {
        return NextResponse.json({ error: "Invalid style" }, { status: 400 });
      }
      await db.collection("agents").doc(agentId).update({
        imageStyle: style,
      });
      return NextResponse.json({ success: true });
    }

    case "image_used": {
      // Auto-reset quota if month has changed
      const agentDoc = await db.collection("agents").doc(agentId).get();
      if (!agentDoc.exists) {
        return NextResponse.json({ error: "Agent not found" }, { status: 404 });
      }
      const agentData = agentDoc.data()!;
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const lastResetMonth = agentData.imageQuotaResetMonth || "";

      if (currentMonth !== lastResetMonth) {
        // New month — reset counter then increment
        await db.collection("agents").doc(agentId).update({
          imageUsed: 1,
          imageQuotaResetMonth: currentMonth,
        });
      } else {
        await db.collection("agents").doc(agentId).update({
          imageUsed: FieldValue.increment(1),
        });
      }
      return NextResponse.json({ success: true });
    }

    case "character_locked": {
      await db.collection("agents").doc(agentId).update({
        characterLocked: true,
        characterLockedAt: new Date().toISOString(),
      });
      return NextResponse.json({ success: true });
    }

    default:
      return NextResponse.json({ error: `Unknown type: ${type}` }, { status: 400 });
  }
}
