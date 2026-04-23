import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import type { AuthUser } from "@/types/auth";
import type { SessionPayload } from "@/types/session";
import { authStore } from "@/lib/auth/storage";

function isTokenPayload(v: unknown): v is SessionPayload {
  if (!v || typeof v !== "object") return false;
  const x = v as any;

  return (
    typeof x.userId === "string" &&
    typeof x.phone === "string"
  );
}

export async function getUserFromRequest(): Promise<AuthUser | null> {
  const token = (await cookies()).get("auth")?.value;
  if (!token) return null;

  try {
    const payload = verifyToken(token);
    if (!isTokenPayload(payload)) return null;

    const user = authStore.getById(payload.userId);
    if (!user) return null;

    return {
      userId: user.userId,
      phone: user.phone,
      activeMembershipId: user.activeMembershipId,
      isSuperadmin: user.isSuperadmin,
      impersonatedBy: user.impersonatedBy,
    };
  } catch {
    return null;
  }
}