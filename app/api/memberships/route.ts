import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { requestMembership, myMemberships } from "@/lib/memberships/domain";
import { assertRequestMembershipDTO } from "@/lib/memberships/validators";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { requireAuth } from "@/lib/auth/guards";

export async function GET() {
    try {
        const rawUser = await getUserFromRequest();
        const user = requireAuth(rawUser);

        return NextResponse.json(myMemberships(user.userId));
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}

export async function POST(req: Request) {
    try {
        const rawUser = await getUserFromRequest();
        const user = requireAuth(rawUser);

        const body: unknown = await req.json();
        assertRequestMembershipDTO(body);

        return NextResponse.json(requestMembership(user.userId, body.tenantId));
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}
