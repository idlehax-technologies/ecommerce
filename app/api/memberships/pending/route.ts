import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { requireAccess } from "@/lib/auth/guards";
import { listAllMembershipsEnriched, listPendingMemberships } from "@/lib/memberships/domain";
import { handleRouteError } from "@/lib/http/handleRouteError";

export async function GET() {
    try {
        const rawUser = await getUserFromRequest();

        const actor = requireAccess(rawUser, ["staff"]);

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