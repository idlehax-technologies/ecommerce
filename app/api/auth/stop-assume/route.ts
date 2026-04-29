import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { signToken } from "@/lib/jwt";

import { handleRouteError } from "@/lib/http/handleRouteError";
import { requireAssumedSession } from "@/lib/auth/guards";
import { guardRequest } from "@/lib/security/requestGuard";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

export async function POST(req: Request) {
    try {
        const rawUser = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        })
        const user = requireAssumedSession(rawUser);

        const token = signToken({
            userId: user.impersonatedBy,
            phone: user.phone,
            isSuperadmin: true,
            activeMembershipId: undefined,
        });

        const cookieStore = await cookies();

        cookieStore.set("auth", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: SEVEN_DAYS,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        return handleRouteError(err);
    }
}