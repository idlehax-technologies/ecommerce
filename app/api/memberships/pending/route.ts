import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { requireAccess } from "@/lib/auth/guards";
import {
    listAllMembershipsEnriched,
    listPendingMemberships
} from "@/lib/memberships/domain";
import { handleRouteError } from "@/lib/http/handleRouteError";

export async function GET(req: Request) {
    try {
        const user = await guardRequest(req, { requireAuth: true });

        const actor = requireAccess(user, ["staff"]);

        if (actor.type === "superadmin") {
            return NextResponse.json(listAllMembershipsEnriched());
        }

        return NextResponse.json(
            listPendingMemberships(actor.membership.tenantId)
        );
    } catch (err) {
        return handleRouteError(err);
    }
}