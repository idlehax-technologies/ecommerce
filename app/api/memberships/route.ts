import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { requireAccess } from "@/lib/auth/guards";
import {
    requestMembership,
    listMembershipsEnriched,
    listAllMembershipsEnriched
} from "@/lib/memberships/domain";
import { assertRequestMembership } from "@/lib/memberships/validators";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { dispatchEvent } from "@/lib/events/dispatcher";

import { QUERY_LIMITS } from "@/lib/config/queryLimits";

export async function GET(req: Request) {
    try {
        const user = await guardRequest(req, { requireAuth: true });

        const actor = requireAccess(user, ["staff"]);

        const memberships =
            actor.type === "superadmin"
                ? listAllMembershipsEnriched(QUERY_LIMITS.MEMBERSHIPS)
                : listMembershipsEnriched(
                    actor.membership.tenantId,
                    QUERY_LIMITS.MEMBERSHIPS
                );

        return NextResponse.json({ memberships });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}

export async function POST(req: Request) {
    try {
        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });

        const body: unknown = await req.json();
        assertRequestMembership(body);

        const result = requestMembership(user.userId, body.tenantId);

        await dispatchEvent(result.event, { actorId: user.userId });

        return NextResponse.json({
            membership: result.membership
        });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}