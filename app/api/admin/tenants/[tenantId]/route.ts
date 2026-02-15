import { NextRequest, NextResponse } from "next/server";
import { getTenant } from "@/lib/tenants/domain";
import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

export async function GET(
    _: NextRequest,
    { params }: { params: { tenantId: string } }
) {
    try {
        const rawUser = await getUserFromRequest();
        requireRole(rawUser, "superadmin");

        const tenant = getTenant(params.tenantId);

        return NextResponse.json(tenant);
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}