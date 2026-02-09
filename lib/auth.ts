// lib/auth.ts

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import type { AuthUser } from "@/types/auth";

function isAuthUser(v: unknown): v is AuthUser {
  if (!v || typeof v !== "object") return false;

  const x = v as any;

  return (
    typeof x.userId === "string" &&
    typeof x.email === "string" &&
    ["customer", "staff", "admin", "superadmin"].includes(x.role)
  );
}

export async function getUserFromRequest(): Promise<AuthUser | null> {
  const token = (await cookies()).get("auth")?.value;
  if (!token) return null;

  try {
    const payload = verifyToken(token);
    return isAuthUser(payload) ? payload : null;
  } catch {
    return null;
  }
}

/* ---------- scope helpers ---------- */

export async function getTenantIdFromRequest(): Promise<string> {
  const user = await getUserFromRequest();
  if (!user?.tenantId) throw new Error("No tenant scope");
  return user.tenantId;
}

export async function requireAdmin() {
  const user = await getUserFromRequest();
  if (!user || user.role !== "admin") throw new Error("Forbidden");
  return user;
}

export async function requireSuperadmin() {
  const user = await getUserFromRequest();
  if (!user || user.role !== "superadmin") throw new Error("Forbidden");
  return user;
}
