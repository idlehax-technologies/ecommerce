import { NextRequest, NextResponse } from "next/server";
import { createTenant, listTenants } from "@/lib/tenants/domain";
import { assertCreateTenantDTO } from "@/lib/tenants/validators";
import { TenantDomainError } from "@/lib/tenants/errors";

export async function GET() {
    return NextResponse.json(listTenants());
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        assertCreateTenantDTO(body);

        const tenant = createTenant(body);

        return NextResponse.json(tenant);
    } catch (err) {
        if (err instanceof TenantDomainError) {
            return NextResponse.json(
                { error: err.message },
                { status: err.status }
            );
        }

        return NextResponse.json(
            { error: "Invalid request" },
            { status: 400 }
        );
    }
}