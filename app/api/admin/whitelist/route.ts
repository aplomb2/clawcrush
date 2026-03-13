// Admin whitelist management
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { db, ADMIN_EMAILS } from "@/lib/firebase-admin";

// GET — list all whitelisted users
export async function GET(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const snap = await db.collection("whitelist").get();
  const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json({ whitelist: list });
}

// POST — add email to whitelist
export async function POST(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { email, note } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();
  await db.collection("whitelist").doc(normalizedEmail).set({
    email: normalizedEmail,
    note: note || "",
    addedBy: user.email,
    addedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true, email: normalizedEmail });
}

// DELETE — remove email from whitelist
export async function DELETE(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  await db.collection("whitelist").doc(email.toLowerCase().trim()).delete();
  return NextResponse.json({ success: true });
}
