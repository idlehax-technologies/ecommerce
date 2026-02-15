import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signToken } from "@/lib/jwt";
import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

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
        const rawUser = await getUserFromRequest();
        const user = requireRole(rawUser, "superadmin");

        const token = signToken({
            userId: user.userId,
            phone: user.phone,
            role: "admin",
            tenantId: params.tenantId,
            impersonatedBy: user.userId,
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
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}
