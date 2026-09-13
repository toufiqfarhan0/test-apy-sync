import { Router, Request, Response } from "express";
import crypto from "crypto";

const router = Router();
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_sample_secret";

// Verify incoming webhook signature against stripeWebhookSecret
function verifyStripeSignature(payload: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", stripeWebhookSecret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

// POST /api/webhooks/stripe
router.post("/api/webhooks/stripe", (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;
  if (!signature) {
    return res.status(400).json({ error: "Missing stripe signature" });
  }
  const payload = JSON.stringify(req.body);
  const isValid = verifyStripeSignature(payload, signature);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid webhook signature" });
  }
  res.status(200).json({ received: true, verified: true });
});

export default router;
