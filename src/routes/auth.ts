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

// In-memory token blacklist for session revocation
const tokenBlacklist = new Set<string>();

// POST /api/auth/refresh - Refresh access token
router.post("/api/auth/refresh", (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken || tokenBlacklist.has(refreshToken)) {
    return res.status(401).json({ error: "Invalid or revoked refresh token" });
  }
  res.status(200).json({ token: "jwt_token_refreshed", refreshToken });
});

// POST /api/auth/logout - Revoke active session
router.post("/api/auth/logout", (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    tokenBlacklist.add(refreshToken);
  }
  res.status(200).json({ success: true, message: "Session revoked successfully" });
});

export default router;
