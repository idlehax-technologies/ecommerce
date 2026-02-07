// lib/db.ts

import bcrypt from "bcryptjs";
import type { UserRole } from "@/types/auth";

export interface DBUser {
  userId: string;
  email: string;
  password: string;

  role: UserRole;
  tenantId: string | null;
}

const users = new Map<string, DBUser>();

export async function findUserByEmail(email: string) {
  for (const u of users.values()) if (u.email === email) return u;
  return null;
}

export async function findUserById(userId: string) {
  return users.get(userId) ?? null;
}

export async function createUser(data: {
  email: string;
  password: string;
}) {
  const userId = crypto.randomUUID();

  const user: DBUser = {
    userId,
    email: data.email,
    password: data.password,
    role: "customer",
    tenantId: null,
  };

  users.set(userId, user);
  return user;
}

export const hashPassword = (p: string) => bcrypt.hash(p, 10);
export const verifyPassword = (p: string, h: string) =>
  bcrypt.compare(p, h);
