import { Router, Request, Response } from "express";

const router = Router();

// POST /api/payments/checkout
router.post("/api/payments/checkout", (req: Request, res: Response) => {
  const { orderId, amount } = req.body;
  if (!orderId || !amount) {
    return res.status(400).json({ error: "orderId and amount are required" });
  }
  res.status(200).json({ clientSecret: "sec_sample_token", paymentId: "pay_1" });
});

export default router;
