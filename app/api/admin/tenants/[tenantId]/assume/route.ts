import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireSuperadmin } from "@/lib/auth";
import { signToken } from "@/lib/jwt";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

/*
  POST /api/admin/tenants/[tenantId]/assume

  Superadmin assumes tenant admin role.

  Result:
  - role -> admin
  - tenantId -> scoped
  - impersonatedBy -> original superadmin id
*/

export async function POST(
    _req: Request,
    { params }: { params: { tenantId: string } }
) {
    try {
        const superadmin = await requireSuperadmin();

        const token = signToken({
            userId: superadmin.userId,
            phone: superadmin.phone,
            role: "admin",
            tenantId: params.tenantId,
            impersonatedBy: superadmin.userId,
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
        return NextResponse.json(
            { error: "Forbidden" },
            { status: 403 }
        );
    }
}
