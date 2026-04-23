import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { requireAccess, requireAuth } from "@/lib/auth/guards";
import { requestMembership, listMembershipsEnriched, listAllMembershipsEnriched } from "@/lib/memberships/domain";
import { assertRequestMembership } from "@/lib/memberships/validators";
import { handleRouteError } from "@/lib/http/handleRouteError";

export async function GET() {
    try {
        const rawUser = await getUserFromRequest();

        const ctx = requireAccess(rawUser, ["staff"]);

        const data =
            ctx.type === "superadmin"
                ? listAllMembershipsEnriched()
                : listMembershipsEnriched(ctx.membership.tenantId);

        return NextResponse.json(data);
    } catch (err) {
        return handleRouteError(err);
    }
}

export async function POST(req: Request) {
    try {
        const user = requireAuth(await getUserFromRequest());

        const body: unknown = await req.json();
        assertRequestMembership(body);

        const m = requestMembership(user.userId, body.tenantId);

        return NextResponse.json(m);
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}
