import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/auth";
import { requireAuth } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

import { getActiveMembership } from "@/lib/memberships/domain";

export async function GET() {
    try {
        const rawUser = await getUserFromRequest();
        const user = requireAuth(rawUser);

        if (!user.activeMembershipId) {
            return NextResponse.json({ membership: null });
        }

        const membership = getActiveMembership(
            user.userId,
            user.activeMembershipId
        );

        return NextResponse.json({ membership });
    } catch (err) {
        return handleRouteError(err);
    }
}