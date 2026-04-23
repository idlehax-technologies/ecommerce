import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { requireAccess } from "@/lib/auth/guards";
import { getMembershipEnriched } from "@/lib/memberships/domain";
import { handleRouteError } from "@/lib/http/handleRouteError";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ membershipId: string }> }
) {
    try {
        const { membershipId } = await params;

        const rawUser = await getUserFromRequest();
        const actor = requireAccess(rawUser, ["staff"]);

        const data = getMembershipEnriched(actor, membershipId);

        return NextResponse.json(data);
    } catch (err) {
        return handleRouteError(err);
    }
}