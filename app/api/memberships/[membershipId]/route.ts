import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { requireMembershipRole, requireMembership } from "@/lib/auth/guards";
import { getMembershipEnriched } from "@/lib/memberships/domain";
import { handleRouteError } from "@/lib/http/handleRouteError";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ membershipId: string }> }
) {
    try {
        const { membershipId } = await params;

        const user = await guardRequest(req, { requireAuth: true });

        await requireMembershipRole(user, ["staff", "admin"]);
        const actor = await requireMembership(user);

        const membership = await getMembershipEnriched(actor, membershipId);

        return NextResponse.json({ membership });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}