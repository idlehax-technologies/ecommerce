import { NextRequest, NextResponse } from "next/server";
import { createTenant, listTenants } from "@/lib/tenants/domain";
import { assertCreateTenantDTO } from "@/lib/tenants/validators";

export async function GET() {
    return NextResponse.json(listTenants());
}

export async function POST(req: NextRequest) {
    const body = await req.json();

    assertCreateTenantDTO(body);

    const tenant = createTenant(body);

    return NextResponse.json(tenant);
}
