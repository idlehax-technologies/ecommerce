import { NextResponse } from "next/server";

import { assertOtpVerify } from "@/lib/auth/validators";
import { mapOtpVerify } from "@/lib/auth/mappers";
import { verifyOtp } from "@/lib/auth/domain";

import { handleRouteError } from "@/lib/http/handleRouteError";
import { guardRequest } from "@/lib/security/requestGuard";
import { AUTH_COOKIE, AUTH_COOKIE_OPTIONS } from "@/lib/auth/cookies";

export async function POST(req: Request) {
    try {
        await guardRequest(req);

        const body: unknown = await req.json();

        assertOtpVerify(body);
        const input = mapOtpVerify(body);

        const { user, token } = await verifyOtp(input);

        const res = NextResponse.json({ user });

        res.cookies.set(AUTH_COOKIE, token, AUTH_COOKIE_OPTIONS);

        return res;
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}