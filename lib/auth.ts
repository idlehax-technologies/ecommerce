import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import type { AuthUser } from "@/types/auth";

// --------------------
// Type guard
// --------------------
function isAuthUser(value: unknown): value is AuthUser {
  if (typeof value !== "object" || value === null) return false;

  const v = value as Record<string, unknown>;

  if (typeof v.id !== "string") return false;
  if (typeof v.email !== "string") return false;
  if (v.role !== "vendor" && v.role !== "customer") return false;

  if (v.role === "vendor" && typeof v.vendorId !== "string") {
    return false;
  }

  return true;
}

// --------------------
// Auth helpers
// --------------------
export async function getUserFromRequest(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies(); // <-- IMPORTANT
    const token = cookieStore.get("auth")?.value;

    if (!token) return null;

    const payload = verifyToken(token); // unknown

    if (!isAuthUser(payload)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getVendorFromRequest(): Promise<{ vendorId: string }> {
  const user = await getUserFromRequest();

  if (!user) {
    throw new Error("Unauthenticated");
  }

  if (user.role !== "vendor") {
    throw new Error("Forbidden");
  }

  if (!user.vendorId) {
    throw new Error("Vendor ID missing");
  }

  return { vendorId: user.vendorId };
}
