import { NextResponse } from "next/server";

import { guardRequest } from "@/lib/security/requestGuard";
import { requireMembership, requireMembershipRole } from "@/lib/auth/guards";

import { handleRouteError } from "@/lib/http/handleRouteError";

import { getReconciliationReport } from "@/lib/reconciliation/service";

export async function GET(req: Request) {
    try {
        const user = await guardRequest(req, { requireAuth: true });

        await requireMembershipRole(user, ["admin"]);
        const actor = await requireMembership(user);

        const report = await getReconciliationReport(actor.tenantId);

        return NextResponse.json({ report });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}