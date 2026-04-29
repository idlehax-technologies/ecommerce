import { NextResponse } from "next/server";
import { requireAccess } from "@/lib/auth/guards";
import { revokeMembership } from "@/lib/memberships/domain";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { dispatchEvent } from "@/lib/events/dispatcher";
import { guardRequest } from "@/lib/security/requestGuard";

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

        const actor = requireAccess(user, ["staff"]);

        const result = revokeMembership(actor, membershipId);

        const actorId =
            actor.type === "superadmin"
                ? actor.userId
                : actor.membership.userId;

        await dispatchEvent(result.event, { actorId });

        return NextResponse.json({ success: true });
    } catch (err) {
        return handleRouteError(err);
    }
}