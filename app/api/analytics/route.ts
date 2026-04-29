import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { requireTenant, requireMembershipRole } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { getTenantAnalytics } from "@/lib/analytics/service";

export async function GET(req: Request) {
    try {
        const user = await guardRequest(req, { requireAuth: true });

        requireMembershipRole(user, ["admin", "staff"]);
        const actor = requireTenant(user);

        const analytics = getTenantAnalytics(actor.tenantId);

        return NextResponse.json(analytics);
    } catch (err) {
        return handleRouteError(err);
    }
}