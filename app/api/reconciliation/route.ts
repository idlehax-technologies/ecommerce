import { NextResponse } from "next/server";

import { guardRequest } from "@/lib/security/requestGuard";
import { requireTenant, requireMembershipRole } from "@/lib/auth/guards";

import { handleRouteError } from "@/lib/http/handleRouteError";

import { getReconciliationReport } from "@/lib/reconciliation/service";

export async function GET(req: Request) {
    try {
        const user = await guardRequest(req, { requireAuth: true });

        requireMembershipRole(user, ["staff"]);
        const actor = requireTenant(user);

        const report = getReconciliationReport(actor.tenantId);

        return NextResponse.json({ report });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}