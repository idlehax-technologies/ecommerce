import { getUserFromRequest } from "@/lib/auth";
import { requireAuth } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { listUserMembershipsEnriched } from "@/lib/memberships/domain";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = requireAuth(await getUserFromRequest());

        const data = listUserMembershipsEnriched(user.userId);

        return NextResponse.json(data);
    } catch (err) {
        return handleRouteError(err);
    }
}