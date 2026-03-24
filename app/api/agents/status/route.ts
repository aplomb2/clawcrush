import { db } from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const snap = await db
    .collection("agents")
    .where("stripeSessionId", "==", sessionId)
    .limit(1)
    .get();

  if (snap.empty) {
    return NextResponse.json({
      status: "provisioning",
      botUsername: null,
      characterName: null,
      persona: null,
    });
  }

  const agent = snap.docs[0].data();
  return NextResponse.json({
    status: agent.status || "provisioning",
    botUsername: agent.botUsername || null,
    characterName: agent.characterName || null,
    persona: agent.persona || null,
  });
}
