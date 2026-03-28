import { NextResponse } from "next/server";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { activateTenantUseCase } from "@/lib/tenants/service";

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
