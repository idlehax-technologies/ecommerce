import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { listUserMembershipsEnriched } from "@/lib/memberships/domain";

export async function GET(req: Request) {
    try {
        const user = await guardRequest(req, { requireAuth: true });

        const memberships = await listUserMembershipsEnriched(user.userId);

        return NextResponse.json({ memberships });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}