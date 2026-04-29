import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { listUserMembershipsEnriched } from "@/lib/memberships/domain";

export async function GET(req: Request) {
    try {
        const user = await guardRequest(req, { requireAuth: true });

        const data = listUserMembershipsEnriched(user.userId);

        return NextResponse.json(data);
    } catch (err) {
        return handleRouteError(err);
    }
}