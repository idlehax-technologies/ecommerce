// app/api/admin/tenants/[tenantId]/activate/route.ts

import { NextResponse } from "next/server";
import { activateTenantUseCase } from "@/lib/tenants/service";
import { handleRouteError } from "@/lib/http/handleRouteError";

export async function POST(
    _: Request,
    { params }: { params: Promise<{ tenantId: string }> }
) {
    try {
        const { tenantId } = await params;
        const tenant = await activateTenantUseCase(tenantId);
        return NextResponse.json(tenant);
    } catch (err) {
        return handleRouteError(err);
    }
}
