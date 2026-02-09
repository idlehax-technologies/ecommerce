import { NextRequest, NextResponse } from "next/server";
import { deactivateTenant } from "@/lib/tenants/domain";

export async function POST(
    _: NextRequest,
    { params }: { params: { tenantId: string } }
) {
    return NextResponse.json(deactivateTenant(params.tenantId));
}
