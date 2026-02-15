import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getUserFromRequest } from "@/lib/auth";
import { signToken } from "@/lib/jwt";

import { handleRouteError } from "@/lib/http/handleRouteError";
import { requireAssumedSession, requireAuth } from "@/lib/auth/guards";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

export async function POST() {
    try {
        const rawUser = await getUserFromRequest();
        const user = requireAssumedSession(rawUser);

        const token = signToken({
            userId: user.impersonatedBy,
            phone: user.phone,
            role: "superadmin",
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
