import { Router, Request, Response } from "express";

const router = Router();

// POST /api/auth/login - Authenticate user
router.post("/api/auth/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  if (email.includes("locked")) {
    return res.status(403).json({ error: "Account temporarily locked" });
  }
  res.status(200).json({ token: "jwt_token_sample", user: { email } });
});

// POST /api/auth/register - Register account
router.post("/api/auth/register", (req: Request, res: Response) => {
  const { email, password, organizationName } = req.body;
  if (!email || !password || !organizationName) {
    return res.status(400).json({ error: "All fields are required" });
  }
  res.status(201).json({ success: true, organizationName });
});

export default router;
