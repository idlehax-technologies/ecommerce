import { NextRequest, NextResponse } from "next/server";
import { getTenant } from "@/lib/tenants/domain";

export async function GET(
    _: NextRequest,
    { params }: { params: { tenantId: string } }
) {
    return NextResponse.json(getTenant(params.tenantId));
}
