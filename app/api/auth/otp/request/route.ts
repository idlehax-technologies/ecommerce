import { NextResponse } from "next/server";

import { assertOtpRequest } from "@/lib/auth/validators";
import { mapOtpRequest } from "@/lib/auth/mappers";
import { requestOtp } from "@/lib/auth/domain";

import { handleRouteError } from "@/lib/http/handleRouteError";
import { guardRequest } from "@/lib/security/requestGuard";

export async function POST(req: Request) {
    try {
        await guardRequest(req, {
            rateLimitKey: "otp_request", // ✅ NEW
        });

        const body: unknown = await req.json();

        assertOtpRequest(body);
        const input = mapOtpRequest(body);

        await requestOtp(input);

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}