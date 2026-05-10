import { NextResponse } from "next/server";

import { guardRequest } from "@/lib/security/requestGuard";
import { requireTenant, requireMembershipRole } from "@/lib/auth/guards";

import { handleRouteError } from "@/lib/http/handleRouteError";

import * as ordersDomain from "@/lib/orders/domain";
import { dispatchEvent } from "@/lib/events/dispatcher";
import { recordLatency, recordRequest, recordUser } from "@/lib/metrics";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    const start = Date.now();
    recordRequest();

    try {
        const { orderId } = await params;

        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });

        requireMembershipRole(user, ["staff"]);
        const actor = requireTenant(user);
        recordUser(actor.userId);

        const result = ordersDomain.cancelOrder(actor.tenantId, orderId);

        await dispatchEvent(result.event, { actorId: actor.userId });

        recordLatency(Date.now() - start);

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        recordLatency(Date.now() - start);
        return handleRouteError(err);
    }
}