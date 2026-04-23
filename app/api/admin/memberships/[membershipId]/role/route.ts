import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { requireSuperadmin } from "@/lib/auth/guards";
import { updateMembershipRole } from "@/lib/memberships/domain";
import { assertUpdateMembershipRole } from "@/lib/memberships/validators";
import { handleRouteError } from "@/lib/http/handleRouteError";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ membershipId: string }> }
) {
    try {
        const { membershipId } = await params;

        const user = requireSuperadmin(await getUserFromRequest());

        const body: unknown = await req.json();
        assertUpdateMembershipRole(body);

        updateMembershipRole(
            user.userId,
            membershipId,
            body.role
        );

        return NextResponse.json({ success: true });
    } catch (err) {
        return handleRouteError(err);
    }
}