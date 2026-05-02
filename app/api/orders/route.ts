import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { requireTenant } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

import * as ordersDomain from "@/lib/orders/domain";
import { QUERY_LIMITS } from "@/lib/config/queryLimits";

export async function GET(req: Request) {
    try {
        const user = await guardRequest(req, { requireAuth: true });
        const actor = requireTenant(user);

        const orders = ordersDomain.listTenantOrders(
            actor.tenantId,
            QUERY_LIMITS.ORDERS
        );

        return NextResponse.json({ orders });
    } catch (err) {
        return handleRouteError(err);
    }
}