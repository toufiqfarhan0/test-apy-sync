import { Router, Request, Response } from "express";

const router = Router();

// GET /api/orders - List orders
router.get("/api/orders", (req: Request, res: Response) => {
  res.status(200).json([
    { id: "ord_1", totalAmount: 4999, status: "completed" }
  ]);
});

// POST /api/orders - Place order
router.post("/api/orders", (req: Request, res: Response) => {
  const { items, totalAmount } = req.body;
  if (!items || !Array.isArray(items) || !totalAmount) {
    return res.status(400).json({ error: "Invalid order items or totalAmount" });
  }
  res.status(200).json({ id: "ord_2", items, totalAmount, status: "pending" });
});

// GET /api/orders/:id - Order details
router.get("/api/orders/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  res.status(200).json({ id, status: "pending" });
});

// GET /api/orders/:id/tracking - Shipment tracking
router.get("/api/orders/:id/tracking", (req: Request, res: Response) => {
  res.status(200).json({ orderId: req.params.id, carrier: "UPS", trackingNumber: "1Z999999" });
});

export default router;
