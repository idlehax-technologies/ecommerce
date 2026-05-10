import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { requireAccess } from "@/lib/auth/guards";
import {
    listAllMembershipsEnriched,
    listPendingMemberships
} from "@/lib/memberships/domain";
import { handleRouteError } from "@/lib/http/handleRouteError";

import { QUERY_LIMITS } from "@/lib/config/queryLimits";

export async function GET(req: Request) {
    try {
        const user = await guardRequest(req, { requireAuth: true });

        const actor = requireAccess(user, ["staff"]);

        const memberships =
            actor.type === "superadmin"
                ? listAllMembershipsEnriched(QUERY_LIMITS.MEMBERSHIPS)
                : listPendingMemberships(actor.membership.tenantId);

        return NextResponse.json({ memberships });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}