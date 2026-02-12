import { NextRequest, NextResponse } from "next/server";
import { getTenant } from "@/lib/tenants/domain";

export async function GET(
    _: NextRequest,
    { params }: { params: { tenantId: string } }
) {
    const tenant = getTenant(params.tenantId);

    if (!tenant) {
        return NextResponse.json(
            { error: "Tenant not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(tenant);
}