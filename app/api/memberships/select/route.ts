import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { requireAuth } from "@/lib/auth/guards";
import { selectMembership } from "@/lib/memberships/domain";
import { assertSelectMembership } from "@/lib/memberships/validators";
import { handleRouteError } from "@/lib/http/handleRouteError";

export async function POST(req: Request) {
    try {
        const user = requireAuth(await getUserFromRequest());

        const body: unknown = await req.json();
        assertSelectMembership(body);

        selectMembership(user.userId, body.membershipId);

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}