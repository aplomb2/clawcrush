import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
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

  // Verify signature if webhook secret is configured
  if (WEBHOOK_SECRET) {
    const valid = await verifyStripeSignature(body, sig, WEBHOOK_SECRET);
    if (!valid) {
      console.error("Webhook signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  }

  const event = JSON.parse(body);
  console.log(`📩 Stripe webhook: ${event.type}`);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const customerEmail = session.customer_details?.email;
      const customerId = session.customer;
      const subscriptionId = session.subscription;
      const metadata = session.metadata || {};

      console.log(`🎉 Checkout completed: ${customerEmail}, plan: ${metadata.plan}`);

      // Store subscription record
      if (subscriptionId) {
        // Find user by email
        const usersSnap = await db
          .collection("agents")
          .where("email", "==", customerEmail)
          .where("status", "==", "provisioning")
          .limit(1)
          .get();

        const userId = usersSnap.empty ? null : usersSnap.docs[0].data().userId;

        await db.collection("subscriptions").doc(subscriptionId).set({
          subscriptionId,
          customerId,
          userId: userId || metadata.userId || "",
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
      const customerId = subscription.customer;

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
      const customerId = invoice.customer;
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
