import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { requireAccess, requireAuth } from "@/lib/auth/guards";
import {
    requestMembership,
    listMembershipsEnriched,
    listAllMembershipsEnriched
} from "@/lib/memberships/domain";
import { assertRequestMembership } from "@/lib/memberships/validators";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { dispatchEvent } from "@/lib/events/dispatcher";

export async function GET(req: Request) {
    try {
        const user = await guardRequest(req, { requireAuth: true });

        const ctx = requireAccess(user, ["staff"]);

        const data =
            ctx.type === "superadmin"
                ? listAllMembershipsEnriched()
                : listMembershipsEnriched(ctx.membership.tenantId);

        return NextResponse.json(data);
    } catch (err) {
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

        return NextResponse.json(result.membership);
    } catch (err) {
        return handleRouteError(err);
    }
}