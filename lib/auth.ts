// lib/auth.ts

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import type { AuthUser, UserRole } from "@/types/auth";
import type { SessionPayload } from "@/types/session";
import { getUserById } from "@/lib/auth/storage";

/*
  Responsibility (system level):

  1) Restore session from cookie
  2) Convert JWT -> real DB user
  3) Provide scope/role helpers for routes

  This file should NEVER know:
  - OTP
  - passwords
  - email
  - login logic

  It only restores identity + enforces authorization.
*/

/* ------------------------------------------------------------------ */
/* payload guard                                                       */
/* ------------------------------------------------------------------ */

function isTokenPayload(v: unknown): v is SessionPayload {
  if (!v || typeof v !== "object") return false;

  const x = v as any;

  return (
    typeof x.userId === "string" &&
    typeof x.phone === "string" &&
    ["customer", "staff", "admin", "superadmin"].includes(x.role)
  );
}

/* ------------------------------------------------------------------ */
/* session restore                                                     */
/* ------------------------------------------------------------------ */

export async function getUserFromRequest(): Promise<AuthUser | null> {
  const token = (await cookies()).get("auth")?.value;
  if (!token) return null;

  try {
    const payload = verifyToken(token);

    if (!isTokenPayload(payload)) return null;

    // Always fetch from storage (never trust token fields directly)
    const dbUser = getUserById(payload.userId);
    if (!dbUser) return null;

    return {
      userId: dbUser.userId,
      phone: dbUser.phone,
      role: dbUser.role,
      tenantId: dbUser.tenantId ?? undefined,
    };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* scope helpers (VERY IMPORTANT – keep these)                         */
/* ------------------------------------------------------------------ */

export async function getTenantIdFromRequest(): Promise<string> {
  const user = await getUserFromRequest();

  if (!user?.tenantId) {
    throw new Error("No tenant scope");
  }

  return user.tenantId;
}

export async function requireRole(role: UserRole) {
  const user = await getUserFromRequest();

  if (!user || user.role !== role) {
    throw new Error("Forbidden");
  }

  return user;
}

export async function requireAdmin() {
  return requireRole("admin");
}

export async function requireSuperadmin() {
  return requireRole("superadmin");
}
