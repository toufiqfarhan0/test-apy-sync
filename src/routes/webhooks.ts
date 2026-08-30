import { Router, Request, Response } from "express";

const router = Router();

// POST /api/webhooks/stripe
router.post("/api/webhooks/stripe", (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"];
  if (!signature) {
    return res.status(400).json({ error: "Missing stripe signature" });
  }
  res.status(200).json({ received: true });
});

export default router;
