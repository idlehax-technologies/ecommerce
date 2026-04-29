import { NextResponse } from "next/server";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { getTenantById } from "@/lib/tenants/service";

import { guardRequest } from "@/lib/security/requestGuard";
import { requireSuperadmin } from "@/lib/auth/guards";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ tenantId: string }> }
) {
    try {
        const { tenantId } = await params;

        const user = await guardRequest(req, { requireAuth: true });
        requireSuperadmin(user);

        const tenant = await getTenantById(tenantId);

        return NextResponse.json(tenant);
    } catch (err) {
        return handleRouteError(err);
    }
}