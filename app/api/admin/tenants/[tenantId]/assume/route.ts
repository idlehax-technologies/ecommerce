// app/api/admin/tenants/[tenantId]/assume/route.ts

import { NextResponse } from "next/server";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { assumeTenantAdminUseCase } from "@/lib/tenants/service";

/**
 * Transport Adapter Only
 * ----------------------
 * This endpoint performs impersonation setup.
 * Cookie + auth mutation is coordinated inside the service.
 */

export async function POST(
    _: Request,
    { params }: { params: Promise<{ tenantId: string }> }
) {
    try {
        const { tenantId } = await params;

        const result = await assumeTenantAdminUseCase(tenantId);

        return NextResponse.json(result);
    } catch (err) {
        return handleRouteError(err);
    }
}