import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { selectMembershipUseCase } from "@/lib/memberships/service";
import { assertSelectMembership } from "@/lib/memberships/validators";
import { handleRouteError } from "@/lib/http/handleRouteError";

export async function POST(req: Request) {
    try {
        await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });

        const body: unknown = await req.json();
        assertSelectMembership(body);

        await selectMembershipUseCase(body.membershipId);

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}