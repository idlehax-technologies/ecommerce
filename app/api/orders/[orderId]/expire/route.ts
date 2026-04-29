import { NextResponse } from "next/server";

import { guardRequest } from "@/lib/security/requestGuard";
import { requireTenant, requireMembershipRole } from "@/lib/auth/guards";

import { handleRouteError } from "@/lib/http/handleRouteError";

import * as ordersDomain from "@/lib/orders/domain";
import { dispatchEvent } from "@/lib/events/dispatcher";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;

        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });

        requireMembershipRole(user, ["staff"]);
        const actor = requireTenant(user);

        const result = ordersDomain.expireOrder(actor.tenantId, orderId);

        await dispatchEvent(result.event, { actorId: actor.userId });

        return NextResponse.json({ success: true });
    } catch (err) {
        return handleRouteError(err);
    }
}