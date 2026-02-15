import { NextResponse } from "next/server";
import { getMembership } from "@/lib/memberships/domain";
import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

export async function GET(
    _: Request,
    { params }: { params: { membershipId: string } }
) {
    try {
        const rawUser = await getUserFromRequest();
        requireRole(rawUser, "staff");

        return NextResponse.json(getMembership(params.membershipId));
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}
