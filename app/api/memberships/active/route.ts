import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { getActiveMembership } from "@/lib/memberships/domain";

export async function GET(req: Request) {
    try {
        const user = await guardRequest(req, { requireAuth: true });

        if (!user.activeMembershipId) {
            return NextResponse.json({ membership: null });
        }

        const membership = await getActiveMembership(
            user.userId,
            user.activeMembershipId
        );

        return NextResponse.json({ membership });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}