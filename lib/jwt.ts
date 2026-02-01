import jwt from "jsonwebtoken";
import { UserRole } from "@/types/auth";

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export type JwtPayload = {
  id: string;
  email: string;
  role: UserRole;
  vendorId?: string;
};

export const signToken = (payload: JwtPayload): string =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

export const verifyToken = (token: string): unknown =>
  jwt.verify(token, JWT_SECRET);
