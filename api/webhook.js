import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

const statusMap = new Set(["trialing", "active", "canceled", "past_due"]);

async function upsertSubscriptionFromStripe(subscription) {
  const userId =
    subscription?.metadata?.user_id ||
    subscription?.items?.data?.[0]?.metadata?.user_id ||
    null;
  if (!userId) return;

  const status = statusMap.has(subscription.status) ? subscription.status : "canceled";
  const trialStart = subscription.trial_start
    ? new Date(subscription.trial_start * 1000).toISOString()
    : null;
  const trialEnd = subscription.trial_end
    ? new Date(subscription.trial_end * 1000).toISOString()
    : null;

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: subscription.customer,
      stripe_subscription_id: subscription.id,
      status,
      trial_start: trialStart,
      trial_end: trialEnd
    },
    { onConflict: "user_id" }
  );
}

async function markSubscriptionCanceled(subscriptionId) {
  if (!subscriptionId) return;
  await supabase
    .from("subscriptions")
    .update({ status: "canceled" })
    .eq("stripe_subscription_id", subscriptionId);
}

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks);
    const signature = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "customer.subscription.updated") {
      await upsertSubscriptionFromStripe(event.data.object);
    }

    if (event.type === "customer.subscription.deleted") {
      await markSubscriptionCanceled(event.data.object?.id);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        subscription.metadata = {
          ...(subscription.metadata || {}),
          user_id: session?.metadata?.user_id || subscription?.metadata?.user_id
        };
        await upsertSubscriptionFromStripe(subscription);
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Webhook error" });
  }
}
