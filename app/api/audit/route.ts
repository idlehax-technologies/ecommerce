import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { requireTenant, requireMembershipRole } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { listAuditByTenant } from "@/lib/audit/storage";

import { QUERY_LIMITS } from "@/lib/config/queryLimits";

export async function GET(req: Request) {
    try {
        const user = await guardRequest(req, { requireAuth: true });

        requireMembershipRole(user, ["admin", "staff"]);
        const actor = requireTenant(user);

        const logs = listAuditByTenant(
            actor.tenantId,
            QUERY_LIMITS.AUDIT
        );

        return NextResponse.json({ logs });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}