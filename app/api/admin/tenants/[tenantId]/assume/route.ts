import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { requireSuperadmin } from "@/lib/auth";
import { signToken } from "@/lib/jwt";

export async function POST(
    _req: Request,
    { params }: { params: { tenantId: string } }
) {
    const superadmin = await requireSuperadmin();

    const tenantId = params.tenantId;

    // build assumed identity
    const token = signToken({
        userId: superadmin.userId,
        email: superadmin.email,
        role: "admin",
        tenantId,
        impersonatedBy: superadmin.userId,
    });

    const cookieStore = await cookies();

    cookieStore.set("auth", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // HTTPS only in prod
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // explicit expiry
    });

    return NextResponse.json({ success: true });
}
