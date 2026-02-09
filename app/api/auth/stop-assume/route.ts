import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getUserFromRequest } from "@/lib/auth";
import { signToken } from "@/lib/jwt";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

/*
  POST /api/auth/stop-assume

  Behavior:
  - only valid if currently assuming
  - restores original superadmin identity
  - clears tenant scope
  - issues fresh JWT cookie
*/

export async function POST() {
    const user = await getUserFromRequest();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // must be an assumed session
    if (!user.impersonatedBy) {
        return NextResponse.json(
            { error: "Not in assumed session" },
            { status: 400 }
        );
    }

    // restore original superadmin identity
    const token = signToken({
        userId: user.impersonatedBy,
        email: user.email,
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
