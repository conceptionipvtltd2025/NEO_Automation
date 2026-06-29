import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { query } from "./db";

function secret() {
  return process.env.JWT_SECRET || "dev-insecure-secret-change-me";
}

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 10);
}

export async function verifyAdmin(username: string, password: string) {
  const rows = await query<{ id: number; username: string; password_hash: string }>(
    `SELECT * FROM admins WHERE username=? LIMIT 1`,
    [username]
  );
  const admin = rows[0];
  if (!admin) return null;
  const ok = await bcrypt.compare(password, admin.password_hash);
  return ok ? { id: admin.id, username: admin.username } : null;
}

export function signToken(payload: { sub: string }) {
  const options: jwt.SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any,
  };
  return jwt.sign(payload, secret(), options);
}

export interface AuthedRequest extends Request {
  user?: { username: string };
}

/** Express middleware — rejects requests without a valid Bearer token. */
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }
  try {
    const decoded = jwt.verify(token, secret()) as { sub: string };
    req.user = { username: decoded.sub };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
