import { NextResponse } from "next/server";

import { guardRequest } from "@/lib/security/requestGuard";
import { requireTenant } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

import * as paymentsDomain from "@/lib/payments/domain";
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

        const actor = requireTenant(user);
        recordUser(actor.userId);

        const result = paymentsDomain.confirmPayment(
            actor.tenantId,
            orderId
        );

        for (const event of result.events) {
            await dispatchEvent(event, { actorId: actor.userId });
        }

        recordLatency(Date.now() - start);

        return NextResponse.json({
            payment: result.payment,
            order: result.order,
        });

    } catch (err: unknown) {
        recordLatency(Date.now() - start);
        return handleRouteError(err);
    }
}