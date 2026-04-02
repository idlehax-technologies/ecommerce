import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/auth";
import { requireTenant, requireRole } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

import { getReconciliationReport } from "@/lib/reconciliation/service";

export async function GET() {
    try {
        const rawUser = await getUserFromRequest();

        requireRole(rawUser, "staff"); // controlled access
        const actor = requireTenant(rawUser);

        const report = getReconciliationReport(actor.tenantId);

        return NextResponse.json(report);

    } catch (err) {
        return handleRouteError(err);
    }
}