import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { requireMembership, requireMembershipRole } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { getAuditLogs } from "@/lib/audit/domain";

import { QUERY_LIMITS } from "@/lib/config/queryLimits";

export async function GET(req: Request) {
    try {
        const user = await guardRequest(req, { requireAuth: true });

        await requireMembershipRole(user, ["admin"]);

        const actor = await requireMembership(user);

        const logs = await getAuditLogs(
            actor.tenantId,
            QUERY_LIMITS.AUDIT
        );

        return NextResponse.json({ logs });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}