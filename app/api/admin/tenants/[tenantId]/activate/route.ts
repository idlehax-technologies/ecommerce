import { NextRequest, NextResponse } from "next/server";
import { activateTenant } from "@/lib/tenants/domain";
import { TenantDomainError } from "@/lib/tenants/errors";

export async function POST(
    _: NextRequest,
    { params }: { params: { tenantId: string } }
) {
    try {
        const tenant = activateTenant(params.tenantId);
        return NextResponse.json(tenant);
    } catch (err) {
        if (err instanceof TenantDomainError) {
            return NextResponse.json(
                { error: err.message },
                { status: err.status }
            );
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
