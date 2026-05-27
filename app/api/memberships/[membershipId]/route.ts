import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import {
    requireMembershipRole,
    requireTenant,
} from "@/lib/auth/guards";
import { getMembershipEnriched } from "@/lib/memberships/domain";
import { handleRouteError } from "@/lib/http/handleRouteError";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ membershipId: string }> }
) {
    try {
        const { membershipId } = await params;

        const user = await guardRequest(req, { requireAuth: true });

        requireMembershipRole(user, ["staff"]);
        const actor = requireTenant(user);

        const membership = getMembershipEnriched(actor, membershipId);

        return NextResponse.json({ membership });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}