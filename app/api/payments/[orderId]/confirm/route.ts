import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/auth";
import { requireTenant } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

import * as paymentsDomain from "@/lib/payments/domain";
import { handleOrderEvent } from "@/lib/orders/reactions";

export async function POST(
    _req: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;

        const rawUser = await getUserFromRequest();
        const actor = requireTenant(rawUser);

        const result = paymentsDomain.confirmPayment(
            actor.tenantId,
            orderId
        );

        if (result.event) {
            await handleOrderEvent(result.event);
        }

        return NextResponse.json(result);

    } catch (err) {
        return handleRouteError(err);
    }
}