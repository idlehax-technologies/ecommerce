import jwt from "jsonwebtoken";
import type { SessionPayload } from "@/types/session";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is required"
  );
}

export const signToken = (payload: SessionPayload): string =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

export const verifyToken = (token: string): unknown =>
  jwt.verify(token, JWT_SECRET);