import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/auth";
import { requireAuth, requireRole } from "@/lib/auth/guards";

import { handleRouteError } from "@/lib/http/handleRouteError";
import { adjustStock } from "@/lib/tenantInventory/adjustment";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ tenantId: string }> }
) {
    try {
        const { tenantId } = await params;

        const rawUser = await getUserFromRequest();
        const user = requireAuth(rawUser);
        requireRole(user, "superadmin");

        const body = await req.json();

        const result = adjustStock({
            tenantId,
            actorId: user.userId,
            request: body,
        });

        return NextResponse.json(result);

    } catch (err) {
        return handleRouteError(err);
    }
}