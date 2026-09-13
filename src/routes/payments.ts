import { Router, Request, Response } from "express";

const router = Router();
const idempotencyStore = new Map<string, any>();

// POST /api/payments/checkout
router.post("/api/payments/checkout", (req: Request, res: Response) => {
  const { orderId, amount, currency = "USD" } = req.body;
  const idempotencyKey = req.headers["idempotency-key"] as string;

  if (!orderId || !amount) {
    return res.status(400).json({ error: "orderId and amount are required" });
  }

  // Idempotent replay check
  if (idempotencyKey && idempotencyStore.has(idempotencyKey)) {
    return res.status(200).json(idempotencyStore.get(idempotencyKey));
  }

  const result = {
    clientSecret: "sec_sample_token",
    paymentId: `pay_${Date.now()}`,
    currency,
    amount,
    idempotent: !!idempotencyKey
  };

  if (idempotencyKey) {
    idempotencyStore.set(idempotencyKey, result);
  }

  res.status(200).json(result);
});

export default router;
