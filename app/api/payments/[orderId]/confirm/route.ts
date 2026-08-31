import { NextResponse } from "next/server";

import { guardRequest } from "@/lib/security/requestGuard";
import { requireMembershipRole, requireMembership } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

import * as paymentsDomain from "@/lib/payments/domain";
import * as ordersDomain from "@/lib/orders/domain";
import { dispatchEvent } from "@/lib/events/dispatcher";
import { recordLatency, recordRequest, recordUser } from "@/lib/metrics";
import { assertOrderVisible } from "@/lib/orders/guards";

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

        await requireMembershipRole(user, ["customer", "staff"]);

        const actor = await requireMembership(user);
        recordUser(actor.userId);

        const targetOrder = await ordersDomain.getTenantOrder(
            actor.tenantId,
            orderId
        );

        assertOrderVisible(actor, targetOrder);

        const result = await paymentsDomain.confirmPayment(
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