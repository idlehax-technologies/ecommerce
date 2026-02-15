import { NextRequest, NextResponse } from "next/server";
import { activateTenant } from "@/lib/tenants/domain";
import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

export async function POST(
    _: NextRequest,
    { params }: { params: { tenantId: string } }
) {
    try {
        const rawUser = await getUserFromRequest();
        requireRole(rawUser, "superadmin");

        const tenant = activateTenant(params.tenantId);

        return NextResponse.json(tenant);
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}
