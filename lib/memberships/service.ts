import { cookies } from "next/headers";

import { selectMembership } from "./domain";

import { getUserFromRequest } from "@/lib/session/session";
import { requireAuth } from "@/lib/auth/guards";

import { signToken } from "@/lib/session/jwt";

import { AUTH_COOKIE, AUTH_COOKIE_OPTIONS } from "@/lib/auth/cookies";

export async function selectMembershipUseCase(
    membershipId: string
): Promise<void> {
    const user = requireAuth(await getUserFromRequest());

    await selectMembership(user.userId, membershipId);

    const token = signToken({
        userId: user.userId,
        phone: user.phone,
        isSuperadmin: user.isSuperadmin,
        activeMembershipId: membershipId,
        impersonatedBy: user.impersonatedBy,
    });

    const cookieStore = await cookies();

    cookieStore.set(AUTH_COOKIE, token, AUTH_COOKIE_OPTIONS);
}