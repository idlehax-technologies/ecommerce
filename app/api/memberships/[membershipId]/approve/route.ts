import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { requireAccess } from "@/lib/auth/guards";
import { approveMembership } from "@/lib/memberships/domain";
import { handleRouteError } from "@/lib/http/handleRouteError";

export async function POST(
    _req: Request,
    { params }: { params: Promise<{ membershipId: string }> }
) {
    try {
        const { membershipId } = await params;

        const rawUser = await getUserFromRequest();
        const actor = requireAccess(rawUser, ["staff"]);

        approveMembership(actor, membershipId);

        return NextResponse.json({ success: true });
    } catch (err) {
        return handleRouteError(err);
    }
}