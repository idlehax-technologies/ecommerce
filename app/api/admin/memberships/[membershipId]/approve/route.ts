import { NextResponse } from "next/server";
import { approveMembership } from "@/lib/memberships/domain";
import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

export async function POST(
    _: Request,
    { params }: { params: { membershipId: string } }
) {
    try {
        const rawUser = await getUserFromRequest();
        requireRole(rawUser, "staff");

        return NextResponse.json(approveMembership(params.membershipId));
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}
