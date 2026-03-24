// POST /api/billing-portal — generate Stripe Customer Portal session URL
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json(
      { error: "Payment system not configured" },
      { status: 500 }
    );
  }

  // Find the user's subscription to get customer ID
  const subsSnap = await db
    .collection("subscriptions")
    .where("userId", "==", user.uid)
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();

  if (subsSnap.empty) {
    return NextResponse.json(
      { error: "No subscription found" },
      { status: 404 }
    );
  }

  const subData = subsSnap.docs[0].data();
  const customerId = subData.customerId;

  if (!customerId) {
    return NextResponse.json(
      { error: "No Stripe customer found" },
      { status: 404 }
    );
  }

  // Create Stripe Billing Portal session
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.clawcrush.net";
  const params = new URLSearchParams();
  params.append("customer", customerId);
  params.append("return_url", `${baseUrl}/dashboard`);

  try {
    const res = await fetch(
      "https://api.stripe.com/v1/billing_portal/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error("Stripe portal error:", err);
      return NextResponse.json(
        { error: err.error?.message || "Failed to create portal session" },
        { status: 500 }
      );
    }

    const session = await res.json();
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("Billing portal error:", e);
    return NextResponse.json(
      { error: "Failed to create billing portal" },
      { status: 500 }
    );
  }
}
