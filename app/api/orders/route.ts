import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { requireTenant } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

import * as ordersDomain from "@/lib/orders/domain";

/**
 * GET /api/orders
 *
 * Returns all orders for the authenticated tenant.
 */
export async function GET() {
    try {
        const rawUser = await getUserFromRequest();
        const actor = requireTenant(rawUser);

        const orders = ordersDomain.listTenantOrders(actor.tenantId);

        return NextResponse.json(orders);
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}