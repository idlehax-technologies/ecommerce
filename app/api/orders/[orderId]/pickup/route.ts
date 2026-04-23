import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/auth";
import { requireTenant, requireMembershipRole } from "@/lib/auth/guards";

import { handleRouteError } from "@/lib/http/handleRouteError";

import * as ordersDomain from "@/lib/orders/domain";
import { handleOrderEvent } from "@/lib/orders/reactions";
import { OrderEvent } from "@/types/orderEvent";

export async function POST(
    _req: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;

        const rawUser = await getUserFromRequest();
        requireMembershipRole(rawUser, ["staff"]);
        const actor = requireTenant(rawUser);

        const result = ordersDomain.markOrderPickedUp(
            actor.tenantId,
            orderId
        );

        const event: OrderEvent = {
            type: "OrderPickedUp",
            order: result.order,
        };

        await handleOrderEvent(event);

        return NextResponse.json({ success: true });
    } catch (err) {
        return handleRouteError(err);
    }
}