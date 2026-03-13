import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { requireTenant } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

import * as ordersDomain from "@/lib/orders/domain";

/**
 * GET /api/orders/:orderId
 *
 * Returns a single order belonging to the tenant.
 */
export async function GET(
    _req: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;

        const rawUser = await getUserFromRequest();
        const actor = requireTenant(rawUser);

        const order = ordersDomain.getTenantOrder(actor.tenantId, orderId);

        return NextResponse.json(order);
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}