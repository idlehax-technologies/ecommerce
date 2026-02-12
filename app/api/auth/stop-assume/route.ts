import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getUserFromRequest } from "@/lib/auth";
import { signToken } from "@/lib/jwt";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

/*
  POST /api/auth/stop-assume

  Restores original superadmin identity.
*/

export async function POST() {
    const user = await getUserFromRequest();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!user.impersonatedBy) {
        return NextResponse.json(
            { error: "Not in assumed session" },
            { status: 400 }
        );
    }

    const token = signToken({
        userId: user.impersonatedBy,
        phone: user.phone, // still same phone
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
}
