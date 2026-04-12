// GET /api/agents/image-quota?agentId=xxx — check remaining image quota
// Called by OpenClaw before generating an image
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  // Verify webhook secret (same auth as OpenClaw webhooks)
  const secret = req.headers.get("X-Webhook-Secret");
  if (!secret || secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const agentId = req.nextUrl.searchParams.get("agentId");
  if (!agentId) {
    return NextResponse.json({ error: "agentId required" }, { status: 400 });
  }

  const doc = await db.collection("agents").doc(agentId).get();
  if (!doc.exists) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const data = doc.data()!;

  // Auto-reset quota if month has changed
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const lastResetMonth = data.imageQuotaResetMonth || "";
  let imageUsed = data.imageUsed || 0;

  if (currentMonth !== lastResetMonth) {
    imageUsed = 0;
    await doc.ref.update({ imageUsed: 0, imageQuotaResetMonth: currentMonth });
  }

  const imageQuota = data.imageQuota || 0;
  const remaining = Math.max(0, imageQuota - imageUsed);

  return NextResponse.json({
    agentId,
    imageEnabled: data.imageEnabled || false,
    imageStyle: data.imageStyle || null,
    imageQuota,
    imageUsed,
    remaining,
    allowed: data.imageEnabled && remaining > 0,
  });
}
