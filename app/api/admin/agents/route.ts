// Admin: list all agents across all users
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { db, ADMIN_EMAILS } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const snap = await db.collection("agents").orderBy("createdAt", "desc").get();
  const agents = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json({ agents });
}
