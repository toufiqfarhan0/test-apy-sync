import { Router, Request, Response } from "express";

const router = Router();

// POST /api/auth/login - Authenticate user
router.post("/api/auth/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
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

// POST /api/auth/forgot-password - Request password reset
router.post("/api/auth/forgot-password", (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });
  res.status(200).json({ message: "Password reset link dispatched" });
});

export default router;
