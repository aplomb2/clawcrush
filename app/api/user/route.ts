// GET /api/user — get current user info + their agents
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { db, ADMIN_EMAILS } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch user's agents from Firestore
  const agentsSnap = await db
    .collection("agents")
    .where("userId", "==", user.uid)
    .get();

  const agents = agentsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json({
    user: {
      uid: user.uid,
      email: user.email,
      name: user.name,
      picture: user.picture,
      isAdmin: ADMIN_EMAILS.includes(user.email),
    },
    agents,
  });
}
