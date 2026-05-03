// app/api/orders/[orderId]/pay/route.ts

import { NextResponse } from "next/server";

import { guardRequest } from "@/lib/security/requestGuard";
import { requireTenant } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

import * as paymentsDomain from "@/lib/payments/domain";
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

        const body = await req.json();

        const result = paymentsDomain.recordPayment(
            actor.tenantId,
            orderId,
            body.method
        );

        recordLatency(Date.now() - start);

        return NextResponse.json({
            success: true,
            orderId: result.order.orderId,
        });

    } catch (err) {
        recordLatency(Date.now() - start);
        return handleRouteError(err);
    }
}