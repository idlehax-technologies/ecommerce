import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { requireMembership, requireMembershipRole } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { getTenantAnalytics } from "@/lib/analytics/service";

export async function GET(req: Request) {
    try {
        const user = await guardRequest(req, { requireAuth: true });

        await requireMembershipRole(user, ["admin"]);

        const actor = await requireMembership(user);

        const analytics = await getTenantAnalytics(actor.tenantId);

        return NextResponse.json({ analytics });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}