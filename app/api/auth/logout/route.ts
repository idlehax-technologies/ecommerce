import { NextResponse } from "next/server";

import { handleRouteError } from "@/lib/http/handleRouteError";
import { guardRequest } from "@/lib/security/requestGuard";
import { AUTH_COOKIE, AUTH_COOKIE_CLEAR_OPTIONS } from "@/lib/auth/cookies";

export async function POST(req: Request) {
    try {
        await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        })

        const res = NextResponse.json({ success: true });

        res.cookies.set(AUTH_COOKIE, "", AUTH_COOKIE_CLEAR_OPTIONS);

        return res;
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}
