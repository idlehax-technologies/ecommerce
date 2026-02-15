import { NextResponse } from "next/server";

import { assertOtpRequest } from "@/lib/auth/validators";
import { mapOtpRequest } from "@/lib/auth/mappers";
import { requestOtp } from "@/lib/auth/domain";

import { handleRouteError } from "@/lib/http/handleRouteError";

export async function POST(req: Request) {
    try {
        const body: unknown = await req.json();

        // transport validation
        assertOtpRequest(body);

        // normalization boundary
        const input = mapOtpRequest(body);

        // business action
        await requestOtp(input);

        return NextResponse.json({ success: true });
    } catch (err) {
        return handleRouteError(err);
    }
}
