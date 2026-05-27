import { NextResponse } from "next/server";

import { guardRequest } from "@/lib/security/requestGuard";
import { requireMembershipRole, requireTenant } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

import * as paymentsDomain from "@/lib/payments/domain";
import * as ordersDomain from "@/lib/orders/domain";

import {
    assertPayOrderDTO,
} from "@/lib/orders/validators";

import {
    recordLatency,
    recordRequest,
    recordUser,
} from "@/lib/metrics";
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

        requireMembershipRole(user, ["customer"]);

        const actor = requireTenant(user);
        recordUser(actor.userId);

        const targetOrder = ordersDomain.getTenantOrder(
            actor.tenantId,
            orderId
        );

        assertOrderVisible(actor, targetOrder);

        const body: unknown = await req.json();

        assertPayOrderDTO(body);

        const result = paymentsDomain.recordPayment(
            actor.tenantId,
            orderId,
            body.method
        );

        recordLatency(Date.now() - start);

        return NextResponse.json({
            payment: result.payment
        });

    } catch (err: unknown) {
        recordLatency(Date.now() - start);
        return handleRouteError(err);
    }
}