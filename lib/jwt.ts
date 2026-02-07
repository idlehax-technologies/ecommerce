// lib/jwt.ts

import jwt from "jsonwebtoken";
import { UserRole } from "@/types/auth";

const JWT_SECRET = process.env.JWT_SECRET!;

export type JwtPayload = {
  userId: string;
  email: string;
  role: UserRole;

  // tenant boundary
  tenantId?: string;
};

export const signToken = (payload: JwtPayload): string =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

export const verifyToken = (token: string): unknown =>
  jwt.verify(token, JWT_SECRET);
