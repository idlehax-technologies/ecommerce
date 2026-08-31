import { cookies } from "next/headers";

import { getUserFromRequest } from "@/lib/session/session";
import { requireAssumedSession } from "./guards";

import { signToken } from "@/lib/session/jwt";

import { AUTH_COOKIE, AUTH_COOKIE_OPTIONS } from "@/lib/auth/cookies";

export async function stopAssumeUseCase(): Promise<void> {
    const user = requireAssumedSession(await getUserFromRequest());

    const token = signToken({
        userId: user.impersonatedBy,
        phone: user.phone,
        isSuperadmin: true,
        activeMembershipId: undefined,
        impersonatedBy: undefined,
    });

    const cookieStore = await cookies();

    cookieStore.set(AUTH_COOKIE, token, AUTH_COOKIE_OPTIONS);
}