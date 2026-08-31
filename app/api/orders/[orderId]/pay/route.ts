import { NextResponse } from "next/server";

import { guardRequest } from "@/lib/security/requestGuard";
import { requireMembershipRole, requireMembership } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

import * as paymentsDomain from "@/lib/payments/domain";
import * as ordersDomain from "@/lib/orders/domain";

import { assertOrderVisible } from "@/lib/orders/guards";
import { assertPayOrderDTO } from "@/lib/orders/validators";

import {
    recordLatency,
    recordRequest,
    recordUser,
} from "@/lib/metrics";

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

        const body: unknown = await req.json();

        assertPayOrderDTO(body);

        if (
            actor.role === "customer" &&
            body.method !== "UPI"
        ) {
            throw new Error(
                "Customers can only pay using UPI"
            );
        }

        if (
            actor.role === "staff" &&
            body.method !== "CASH"
        ) {
            throw new Error(
                "Staff can only confirm cash payments"
            );
        }

        const result = await paymentsDomain.recordPayment(
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