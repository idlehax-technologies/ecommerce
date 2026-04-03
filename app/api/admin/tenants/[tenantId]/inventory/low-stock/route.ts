import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/auth";
import { requireAuth, requireRole } from "@/lib/auth/guards";

import { handleRouteError } from "@/lib/http/handleRouteError";
import { getLowStockReport } from "@/lib/tenantInventory/lowStockService";

export async function GET(
    _: Request,
    { params }: { params: Promise<{ tenantId: string }> }
) {
    try {
        const { tenantId } = await params;

        const rawUser = await getUserFromRequest();
        const user = requireAuth(rawUser);
        requireRole(user, "superadmin");

        const report = getLowStockReport(tenantId);

        return NextResponse.json(report);

    } catch (err) {
        return handleRouteError(err);
    }
}