import bcrypt from "bcryptjs";

/* =========================
   Types
========================= */

import type { UserRole } from "@/types/auth";

export interface DBUser {
  id: string;
  email: string;
  password: string;
  role: UserRole;
}

/* =========================
   Fake DB (replace later)
========================= */

// In-memory store for now
const users = new Map<string, DBUser>();

/* =========================
   Queries
========================= */

export async function findUserByEmail(email: string): Promise<DBUser | null> {
  for (const user of users.values()) {
    if (user.email === email) return user;
  }
  return null;
}

export async function findUserById(id: string): Promise<DBUser | null> {
  return users.get(id) || null;
}

/* =========================
   Mutations
========================= */

export async function createUser(data: {
  email: string;
  password: string;
  role: UserRole;
}): Promise<DBUser> {
  const id = crypto.randomUUID();

  const user: DBUser = {
    id,
    email: data.email,
    password: data.password,
    role: data.role
  };

  users.set(id, user);
  return user;
}

/* =========================
   Password helpers
========================= */

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}
