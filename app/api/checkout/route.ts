import { PLANS, PlanKey } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json(
        { error: "Payment system not configured" },
        { status: 500 }
      );
    }

    const { plan, boyfriendId, userId, email, gclid, utmSource, utmCampaign, utmTerm } = await req.json();

    if (!plan || !PLANS[plan as PlanKey]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const selectedPlan = PLANS[plan as PlanKey];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.clawcrush.net";

    // Use Stripe API directly via fetch (avoids SDK connection issues on Vercel)
    const params = new URLSearchParams();
    params.append("mode", "subscription");
    params.append("payment_method_types[0]", "card");
    params.append("line_items[0][price]", selectedPlan.priceId);
    params.append("line_items[0][quantity]", "1");
    params.append("metadata[plan]", plan);
    params.append("metadata[boyfriendId]", boyfriendId || "warm-senior");
    params.append("metadata[userId]", userId || "");
    if (gclid) params.append("metadata[gclid]", gclid);
    if (utmSource) params.append("metadata[utm_source]", utmSource);
    if (utmCampaign) params.append("metadata[utm_campaign]", utmCampaign);
    if (utmTerm) params.append("metadata[utm_term]", utmTerm);
    if (email) {
      params.append("customer_email", email);
    }
    params.append(
      "success_url",
      `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`
    );
    params.append("cancel_url", `${baseUrl}/payment/cancel`);
    params.append("allow_promotion_codes", "true");

    const response = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Stripe error:", data);
      return NextResponse.json(
        { error: "Payment error", detail: data.error?.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: data.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Checkout error:", message);
    return NextResponse.json(
      { error: "Failed to create checkout session", detail: message },
      { status: 500 }
    );
  }
}
