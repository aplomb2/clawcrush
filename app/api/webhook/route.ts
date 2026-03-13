import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const { plan, boyfriendId } = session.metadata || {};
      const customerEmail = session.customer_details?.email;
      const customerId = session.customer as string;

      console.log(
        `🎉 New subscription: ${customerEmail} → ${plan} (${boyfriendId})`
      );

      // TODO: Provision OpenClaw agent for this user
      // 1. Create agent directory from template
      // 2. Configure SOUL.md with boyfriend personality
      // 3. Set up Telegram bot connection
      // 4. Start agent on gateway

      // For now, log it — we'll implement provisioning next
      console.log("TODO: Provision agent", {
        customerId,
        customerEmail,
        plan,
        boyfriendId,
      });

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      console.log(`❌ Subscription cancelled: ${customerId}`);

      // TODO: Deactivate OpenClaw agent
      // 1. Stop agent on gateway
      // 2. Archive (don't delete) agent data

      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      console.log(`⚠️ Payment failed: ${customerId}`);

      // TODO: Notify user, pause agent after grace period

      break;
    }

    default:
      console.log(`Unhandled event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
