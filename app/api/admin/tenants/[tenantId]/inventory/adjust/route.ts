import { NextResponse } from "next/server";

import { requireSuperadmin } from "@/lib/auth/guards";

import { handleRouteError } from "@/lib/http/handleRouteError";
import { adjustStock } from "@/lib/tenantInventory/adjustment";

import { dispatchEvent } from "@/lib/events/dispatcher";
import { guardRequest } from "@/lib/security/requestGuard";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ tenantId: string }> }
) {
    try {
        const { tenantId } = await params;

        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });
        requireSuperadmin(user);

        const body = await req.json();

        const result = adjustStock({
            tenantId,
            actorId: user.userId,
            request: body,
        });

        if (result.event) {
            await dispatchEvent(result.event, { actorId: user.userId });
        }

        return NextResponse.json({
            updated: result.updated
        });
    } catch (err) {
        return handleRouteError(err);
    }
}