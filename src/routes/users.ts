import { Router, Request, Response } from "express";

const router = Router();

// GET /api/users - List users
router.get("/api/users", (req: Request, res: Response) => {
  res.status(200).json([
    { id: "usr_1", name: "Alice Smith", email: "alice@example.com" },
    { id: "usr_2", name: "Bob Jones", email: "bob@example.com" }
  ]);
});

// GET /api/users/:id - Get user profile
router.get("/api/users/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  res.status(200).json({ id, name: "Alice Smith", email: "alice@example.com" });
});

// POST /api/users - Create new user
router.post("/api/users", (req: Request, res: Response) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  res.status(201).json({ id: "usr_3", name, email });
});

export default router;
