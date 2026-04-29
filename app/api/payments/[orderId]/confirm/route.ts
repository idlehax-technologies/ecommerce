import { NextResponse } from "next/server";

import { guardRequest } from "@/lib/security/requestGuard";
import { requireTenant } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

import * as paymentsDomain from "@/lib/payments/domain";
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

        const actor = requireTenant(user);

        const result = paymentsDomain.confirmPayment(
            actor.tenantId,
            orderId
        );

        for (const event of result.events) {
            await dispatchEvent(event, { actorId: actor.userId });
        }

        return NextResponse.json({
            payment: result.payment,
            order: result.order,
        });

    } catch (err) {
        return handleRouteError(err);
    }
}