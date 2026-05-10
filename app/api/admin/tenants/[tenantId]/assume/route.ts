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

        await assumeTenantAdminUseCase(tenantId);

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}