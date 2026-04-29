import { NextResponse } from "next/server";
import { handleRouteError } from "@/lib/http/handleRouteError";

import { guardRequest } from "@/lib/security/requestGuard";
import { requireSuperadmin } from "@/lib/auth/guards";

import { archiveTenantUseCase } from "@/lib/tenants/service";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ tenantId: string }> }
) {
    try {
        const { tenantId } = await params;

        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });
        requireSuperadmin(user);

        const tenant = await archiveTenantUseCase(tenantId);

        return NextResponse.json(tenant);
    } catch (err) {
        return handleRouteError(err);
    }
}