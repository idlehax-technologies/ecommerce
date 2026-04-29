import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/auth";
import { requireSuperadmin } from "@/lib/auth/guards";

import { handleRouteError } from "@/lib/http/handleRouteError";
import { getLowStockReport } from "@/lib/tenantInventory/lowStockService";
import { guardRequest } from "@/lib/security/requestGuard";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ tenantId: string }> }
) {
    try {
        const { tenantId } = await params;

        const user = await guardRequest(req, { requireAuth: true });
        requireSuperadmin(user);

        const report = getLowStockReport(tenantId);

        return NextResponse.json(report);
    } catch (err) {
        return handleRouteError(err);
    }
}