import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/auth";
import { requireTenant } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

import * as paymentsDomain from "@/lib/payments/domain";
import { handleOrderEvent } from "@/lib/orders/reactions";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;

        const rawUser = await getUserFromRequest();
        const actor = requireTenant(rawUser);

        const body = await req.json();

        const { method } = body;

        const result = paymentsDomain.recordPayment(
            actor.tenantId,
            orderId,
            method
        );

        return NextResponse.json({
            success: true,
            orderId: result.order.orderId,
        });

    } catch (err) {
        return handleRouteError(err);
    }
}