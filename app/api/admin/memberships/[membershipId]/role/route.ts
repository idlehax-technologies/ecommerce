import { NextResponse } from "next/server";
import { requireSuperadmin } from "@/lib/auth/guards";
import { updateMembershipRole } from "@/lib/memberships/domain";
import { assertUpdateMembershipRole } from "@/lib/memberships/validators";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { dispatchEvent } from "@/lib/events/dispatcher";
import { guardRequest } from "@/lib/security/requestGuard";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ membershipId: string }> }
) {
    try {
        const { membershipId } = await params;

        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });
        requireSuperadmin(user);

        const body: unknown = await req.json();
        assertUpdateMembershipRole(body);

        const result = updateMembershipRole(
            user.userId,
            membershipId,
            body.role
        );

        await dispatchEvent(result.event, { actorId: user.userId });

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}