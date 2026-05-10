import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { requireTenant } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

import * as ordersDomain from "@/lib/orders/domain";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;

        const user = await guardRequest(req, { requireAuth: true });
        const actor = requireTenant(user);

        const order = ordersDomain.getTenantOrder(actor.tenantId, orderId);

        return NextResponse.json({ order });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}