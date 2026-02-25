// app/api/admin/tenants/[tenantId]/route.ts

import { NextResponse } from "next/server";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { getTenantById } from "@/lib/tenants/service";

/**
 * Transport Adapter Only
 * ----------------------
 * - No authorization logic here
 * - No domain orchestration here
 * - Delegates entirely to service layer
 */

export async function GET(
    _: Request,
    { params }: { params: Promise<{ tenantId: string }> }
) {
    try {
        const { tenantId } = await params;

        const tenant = await getTenantById(tenantId);

        return NextResponse.json(tenant);
    } catch (err) {
        return handleRouteError(err);
    }
}