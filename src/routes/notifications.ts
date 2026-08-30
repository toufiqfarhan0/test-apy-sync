import { Router, Request, Response } from "express";

const router = Router();

// GET /api/notifications
router.get("/api/notifications", (req: Request, res: Response) => {
  res.status(200).json([
    { id: "notif_1", title: "API Drift Alert", read: false }
  ]);
});

export default router;
