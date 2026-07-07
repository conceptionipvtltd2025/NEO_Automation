import { Router } from "express";
import { verifyAdmin, signToken, requireAuth, type AuthedRequest } from "../auth";

const router = Router();

// POST /api/auth/login  { username, password } -> { token, user }
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    const admin = await verifyAdmin(String(username).trim(), String(password));
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = signToken({ sub: admin.username });
    res.json({ token, user: admin.username });
  } catch (e) {
    next(e);
  }
});

// GET /api/auth/me -> { user }  (validates the token)
router.get("/me", requireAuth, (req: AuthedRequest, res) => {
  res.json({ user: req.user?.username });
});

export default router;
