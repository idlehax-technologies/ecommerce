import { NextResponse } from "next/server";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { assumeTenantAdminUseCase } from "@/lib/tenants/service";

import { guardRequest } from "@/lib/security/requestGuard";
import { requireSuperadmin } from "@/lib/auth/guards";

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

        const result = await assumeTenantAdminUseCase(tenantId);

        return NextResponse.json(result);
    } catch (err) {
        return handleRouteError(err);
    }
}