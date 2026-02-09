import { NextRequest, NextResponse } from "next/server";
import { activateTenant } from "@/lib/tenants/domain";

export async function POST(
    _: NextRequest,
    { params }: { params: { tenantId: string } }
) {
    return NextResponse.json(activateTenant(params.tenantId));
}
