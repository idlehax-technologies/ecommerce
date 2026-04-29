import { NextResponse } from "next/server";

import { guardRequest } from "@/lib/security/requestGuard";
import { requireTenant } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

import * as paymentsDomain from "@/lib/payments/domain";

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

        const body = await req.json();

        const result = paymentsDomain.recordPayment(
            actor.tenantId,
            orderId,
            body.method
        );

        return NextResponse.json({
            success: true,
            orderId: result.order.orderId,
        });

    } catch (err) {
        return handleRouteError(err);
    }
}