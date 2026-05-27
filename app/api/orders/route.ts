import { NextResponse } from "next/server";

import { guardRequest } from "@/lib/security/requestGuard";

import { requireTenant } from "@/lib/auth/guards";

import { handleRouteError } from "@/lib/http/handleRouteError";

import * as ordersDomain from "@/lib/orders/domain";

import { filterVisibleOrders } from "@/lib/orders/guards";

import { QUERY_LIMITS } from "@/lib/config/queryLimits";

export async function GET(
    req: Request
) {
    try {
        const user = await guardRequest(req, { requireAuth: true });

        const actor = requireTenant(user);

        const tenantOrders = await ordersDomain.listTenantOrders(
            actor.tenantId,
            QUERY_LIMITS.ORDERS
        );

        const orders = filterVisibleOrders(actor, tenantOrders);

        return NextResponse.json({ orders });

    } catch (err: unknown) {
        return handleRouteError(err);
    }
}