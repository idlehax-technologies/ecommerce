import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { requireAccess } from "@/lib/auth/guards";
import { approveMembership } from "@/lib/memberships/domain";
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

        const actor = requireAccess(user, ["staff"]);

        const result = approveMembership(actor, membershipId);

        const actorId =
            actor.type === "superadmin"
                ? actor.userId
                : actor.membership.userId;

        await dispatchEvent(result.event, { actorId });

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}