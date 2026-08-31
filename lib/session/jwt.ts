import jwt from "jsonwebtoken";
import type { AuthUser } from "@/types/auth";
import { SESSION_MAX_AGE_SECONDS } from "../config/session";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is required"
  );
}

export const signToken = (payload: AuthUser): string =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: `${SESSION_MAX_AGE_SECONDS}s` });

export const verifyToken = (token: string): unknown =>
  jwt.verify(token, JWT_SECRET);