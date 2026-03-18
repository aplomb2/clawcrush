import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

// Verify Stripe webhook signature manually (no SDK dependency issues)
async function verifyStripeSignature(
  body: string,
  sig: string,
  secret: string
): Promise<boolean> {
  if (!secret) return false;

  const parts = sig.split(",").reduce(
    (acc, part) => {
      const [key, value] = part.split("=");
      if (key === "t") acc.timestamp = value;
      if (key === "v1") acc.signatures.push(value);
      return acc;
    },
    { timestamp: "", signatures: [] as string[] }
  );

  const payload = `${parts.timestamp}.${body}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );
  const expectedSig = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return parts.signatures.includes(expectedSig);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  // Verify Stripe signature — reject if secret is not configured
  if (!WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET not configured — rejecting webhook");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }
  const valid = await verifyStripeSignature(body, sig, WEBHOOK_SECRET);
  if (!valid) {
    console.error("Webhook signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);
  console.log(`📩 Stripe webhook: ${event.type}`);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const customerEmail = session.customer_details?.email;
      const subscriptionId = session.subscription;
      const metadata = session.metadata || {};

      console.log(`🎉 Checkout completed: ${customerEmail}, plan: ${metadata.plan}`);

      // Store subscription record
      if (subscriptionId) {
        // Prefer userId from metadata (set at checkout), fall back to email lookup
        let userId = metadata.userId || "";
        if (!userId) {
          const agentSnap = await db
            .collection("agents")
            .where("email", "==", customerEmail)
            .where("status", "==", "provisioning")
            .limit(1)
            .get();
          userId = agentSnap.empty ? "" : agentSnap.docs[0].data().userId;
        }

        const customerId = session.customer;
        await db.collection("subscriptions").doc(subscriptionId).set({
          subscriptionId,
          customerId,
          userId,
          email: customerEmail,
          plan: metadata.plan || "premium",
          boyfriendId: metadata.boyfriendId || "",
          status: "active",
          createdAt: new Date().toISOString(),
        });

        console.log(`✅ Subscription ${subscriptionId} stored`);
      }

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const subscriptionId = subscription.id;

      console.log(`❌ Subscription cancelled: ${subscriptionId}`);

      // Update subscription status
      const subDoc = db.collection("subscriptions").doc(subscriptionId);
      const subSnap = await subDoc.get();

      if (subSnap.exists) {
        await subDoc.update({
          status: "cancelled",
          cancelledAt: new Date().toISOString(),
        });

        const subData = subSnap.data()!;

        // Find and suspend all agents for this user
        const agentsSnap = await db
          .collection("agents")
          .where("userId", "==", subData.userId)
          .where("status", "==", "active")
          .get();

        for (const doc of agentsSnap.docs) {
          await doc.ref.update({
            status: "suspended",
            suspendedAt: new Date().toISOString(),
            suspendReason: "subscription_cancelled",
          });
          console.log(`⏸️ Agent ${doc.id} suspended`);
        }
      }

      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;
      const attemptCount = invoice.attempt_count || 1;

      console.log(`⚠️ Payment failed: ${subscriptionId}, attempt #${attemptCount}`);

      // Find subscription
      if (subscriptionId) {
        const subDoc = db.collection("subscriptions").doc(subscriptionId);
        const subSnap = await subDoc.get();

        if (subSnap.exists) {
          const subData = subSnap.data()!;

          await subDoc.update({
            paymentFailedAt: new Date().toISOString(),
            paymentAttempts: attemptCount,
          });

          // Grace period: suspend after 3rd failed attempt
          if (attemptCount >= 3) {
            const agentsSnap = await db
              .collection("agents")
              .where("userId", "==", subData.userId)
              .where("status", "==", "active")
              .get();

            for (const doc of agentsSnap.docs) {
              await doc.ref.update({
                status: "suspended",
                suspendedAt: new Date().toISOString(),
                suspendReason: "payment_failed",
              });
              console.log(`⏸️ Agent ${doc.id} suspended (payment failed x${attemptCount})`);
            }
          }
        }
      }

      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const subscriptionId = subscription.id;
      const status = subscription.status;

      console.log(`🔄 Subscription updated: ${subscriptionId} → ${status}`);

      const subDoc = db.collection("subscriptions").doc(subscriptionId);
      const subSnap = await subDoc.get();

      if (subSnap.exists) {
        await subDoc.update({
          status: status === "active" ? "active" : status,
          updatedAt: new Date().toISOString(),
        });

        // If reactivated, unsuspend agents
        if (status === "active") {
          const subData = subSnap.data()!;
          const agentsSnap = await db
            .collection("agents")
            .where("userId", "==", subData.userId)
            .where("status", "==", "suspended")
            .get();

          for (const doc of agentsSnap.docs) {
            await doc.ref.update({
              status: "active",
              reactivatedAt: new Date().toISOString(),
            });
            console.log(`▶️ Agent ${doc.id} reactivated`);
          }
        }
      }

      break;
    }

    default:
      console.log(`Unhandled event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
