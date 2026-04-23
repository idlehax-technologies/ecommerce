import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/auth";
import { requireSuperadmin } from "@/lib/auth/guards";

import { handleRouteError } from "@/lib/http/handleRouteError";
import { getLowStockReport } from "@/lib/tenantInventory/lowStockService";

export async function GET(
    _: Request,
    { params }: { params: Promise<{ tenantId: string }> }
) {
    try {
        const { tenantId } = await params;

        const rawUser = await getUserFromRequest();
        requireSuperadmin(rawUser);

        const report = getLowStockReport(tenantId);

        return NextResponse.json(report);
    } catch (err) {
        return handleRouteError(err);
    }
}