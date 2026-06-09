import { NextResponse } from "next/server";

import { guardRequest } from "@/lib/security/requestGuard";
import { handleRouteError } from "@/lib/http/handleRouteError";

import { getTenantById } from "@/lib/tenants/service";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ tenantId: string }> }
) {
    try {
        const { tenantId } = await params;

        await guardRequest(req, { requireAuth: true });

        const tenant = await getTenantById(tenantId);

        return NextResponse.json({ tenant });

    } catch (err: unknown) {
        return handleRouteError(err);
    }
}