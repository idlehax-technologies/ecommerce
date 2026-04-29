import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { requireAccess } from "@/lib/auth/guards";
import { getMembershipEnriched } from "@/lib/memberships/domain";
import { handleRouteError } from "@/lib/http/handleRouteError";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ membershipId: string }> }
) {
    try {
        const { membershipId } = await params;

        const user = await guardRequest(req, { requireAuth: true });
        const actor = requireAccess(user, ["staff"]);

        const data = getMembershipEnriched(actor, membershipId);

        return NextResponse.json(data);
    } catch (err) {
        return handleRouteError(err);
    }
}