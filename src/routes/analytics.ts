import { Router, Request, Response } from "express";

const router = Router();

// GET /api/analytics/summary
router.get("/api/analytics/summary", (req: Request, res: Response) => {
  res.status(200).json({
    totalUsers: 1420,
    activeDrifts: 3,
    syncSuccessRate: "99.4%"
  });
});

export default router;
