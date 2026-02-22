// app/api/admin/tenants/[tenantId]/deactivate/route.ts

import { NextResponse } from "next/server";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { deactivateTenantUseCase } from "@/lib/tenants/service";

/**
 * Transport Adapter Only
 * ----------------------
 * The route knows HTTP.
 * The service knows the rules.
 */

export async function POST(
    _: Request,
    { params }: { params: Promise<{ tenantId: string }> }
) {
    try {
        const { tenantId } = await params;

        const tenant = await deactivateTenantUseCase(tenantId);

        return NextResponse.json(tenant);
    } catch (err) {
        return handleRouteError(err);
    }
}