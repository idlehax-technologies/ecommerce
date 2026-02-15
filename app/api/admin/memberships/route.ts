import { NextResponse } from "next/server";
import { pendingMemberships } from "@/lib/memberships/domain";
import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

export async function GET() {
    try {
        const rawUser = await getUserFromRequest();
        requireRole(rawUser, "staff");

        return NextResponse.json(pendingMemberships());
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}
