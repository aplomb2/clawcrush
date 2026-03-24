// GET /api/subscription — get current user's subscription details
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find subscription(s) for this user
  const subsSnap = await db
    .collection("subscriptions")
    .where("userId", "==", user.uid)
    .orderBy("createdAt", "desc")
    .limit(5)
    .get();

  if (subsSnap.empty) {
    return NextResponse.json({ subscription: null, history: [] });
  }

  // Get the most recent active/trialing subscription
  const allSubs = subsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const activeSub = allSubs.find(
    (s: Record<string, unknown>) => s.status === "active" || s.status === "trialing"
  ) || allSubs[0];

  // Fetch latest invoice/period info from Stripe
  let stripeDetails = null;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const subscriptionId = (activeSub as Record<string, unknown>).subscriptionId as string;

  if (stripeKey && subscriptionId) {
    try {
      const res = await fetch(
        `https://api.stripe.com/v1/subscriptions/${subscriptionId}`,
        {
          headers: { Authorization: `Bearer ${stripeKey}` },
        }
      );
      if (res.ok) {
        const stripeSub = await res.json();
        stripeDetails = {
          status: stripeSub.status,
          currentPeriodStart: stripeSub.current_period_start,
          currentPeriodEnd: stripeSub.current_period_end,
          cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
          cancelAt: stripeSub.cancel_at,
          trialEnd: stripeSub.trial_end,
          defaultPaymentMethod: stripeSub.default_payment_method,
          latestInvoice: stripeSub.latest_invoice,
          items: stripeSub.items?.data?.map(
            (item: Record<string, unknown>) => ({
              priceId: (item.price as Record<string, unknown>)?.id,
              amount: (item.price as Record<string, unknown>)?.unit_amount,
              currency: (item.price as Record<string, unknown>)?.currency,
              interval: ((item.price as Record<string, unknown>)?.recurring as Record<string, unknown>)?.interval,
            })
          ),
        };
      }
    } catch (e) {
      console.error("Failed to fetch Stripe subscription:", e);
    }
  }

  return NextResponse.json({
    subscription: {
      ...activeSub,
      stripe: stripeDetails,
    },
    history: allSubs,
  });
}
