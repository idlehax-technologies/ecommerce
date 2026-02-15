import { NextResponse } from "next/server";

import { assertOtpVerify } from "@/lib/auth/validators";
import { mapOtpVerify } from "@/lib/auth/mappers";
import { verifyOtp } from "@/lib/auth/domain";

import { handleRouteError } from "@/lib/http/handleRouteError";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

export async function POST(req: Request) {
    try {
        const body: unknown = await req.json();

        assertOtpVerify(body);
        const input = mapOtpVerify(body);

        const { user, token } = await verifyOtp(input);

        const res = NextResponse.json({ user });

        res.cookies.set("auth", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: SEVEN_DAYS,
        });

        return res;
    } catch (err) {
        return handleRouteError(err);
    }
}
