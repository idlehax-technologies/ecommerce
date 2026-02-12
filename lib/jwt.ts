// lib/jwt.ts

import jwt from "jsonwebtoken";
import type { SessionPayload } from "@/types/session";

const JWT_SECRET = process.env.JWT_SECRET!;

export const signToken = (payload: SessionPayload): string =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

export const verifyToken = (token: string): unknown =>
  jwt.verify(token, JWT_SECRET);
