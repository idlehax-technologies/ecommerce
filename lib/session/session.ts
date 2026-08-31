import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session/jwt";
import type { AuthUser } from "@/types/auth";
import { authStore } from "@/lib/auth/storage";
import { AUTH_COOKIE } from "@/lib/auth/cookies";

function isTokenPayload(
  payload: unknown
): payload is AuthUser {

  if (
    !payload ||
    typeof payload !== "object"
  ) {
    return false;
  }

  const obj = payload as Record<string, unknown>;

  return (
    typeof obj.userId === "string" &&
    typeof obj.phone === "string" &&
    typeof obj.isSuperadmin === "boolean" &&

    (
      obj.activeMembershipId === undefined ||
      typeof obj.activeMembershipId === "string"
    ) &&

    (
      obj.impersonatedBy === undefined ||
      typeof obj.impersonatedBy === "string"
    )
  );
}

export async function getUserFromRequest(): Promise<AuthUser | null> {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) return null;

  try {
    const payload = verifyToken(token);
    if (!isTokenPayload(payload)) return null;

    const user = await authStore.getById(payload.userId);

    if (!user) {
      return null;
    }

    const activeMembershipId =
      payload.activeMembershipId ??
      user.activeMembershipId;

    return {
      userId: payload.userId,
      phone: payload.phone,
      activeMembershipId,
      isSuperadmin: payload.isSuperadmin,
      impersonatedBy: payload.impersonatedBy,
    };

  } catch {
    return null;
  }
}