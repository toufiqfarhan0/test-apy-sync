import { Router, Request, Response } from "express";

const router = Router();

// GET /api/teams
router.get("/api/teams", (req: Request, res: Response) => {
  res.status(200).json([{ id: "team_1", name: "Engineering" }]);
});

// POST /api/teams
router.post("/api/teams", (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Team name is required" });
  }
  res.status(201).json({ id: "team_2", name });
});

export default router;
