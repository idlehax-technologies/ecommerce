import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import {
    requireMembershipRole,
    requireTenant,
} from "@/lib/auth/guards";
import { rejectMembership } from "@/lib/memberships/domain";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { dispatchEvent } from "@/lib/events/dispatcher";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ membershipId: string }> }
) {
    try {
        const { membershipId } = await params;

        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });

        requireMembershipRole(user, ["staff"]);
        const actor = requireTenant(user);

        const result = rejectMembership(actor, membershipId);

        await dispatchEvent(result.event, { actorId: actor.userId });

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}