import { NextResponse } from "next/server";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { archiveTenantUseCase } from "@/lib/tenants/service";

export async function POST(
    _: Request,
    { params }: { params: Promise<{ tenantId: string }> }
) {
    try {
        const { tenantId } = await params;

        const tenant = await archiveTenantUseCase(tenantId);

        return NextResponse.json(tenant);
    } catch (err) {
        return handleRouteError(err);
    }
}