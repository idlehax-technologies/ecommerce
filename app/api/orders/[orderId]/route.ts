import { NextResponse } from "next/server";

import { guardRequest } from "@/lib/security/requestGuard";

import { requireMembershipRole, requireMembership } from "@/lib/auth/guards";

import { handleRouteError } from "@/lib/http/handleRouteError";

import { assertOrderVisible } from "@/lib/orders/guards";

import * as ordersDomain from "@/lib/orders/domain";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;

        const user = await guardRequest(req, { requireAuth: true });

        await requireMembershipRole(user, ["customer", "staff"]);
        const actor = await requireMembership(user);

        const order = await ordersDomain.getTenantOrder(
            actor.tenantId,
            orderId
        );

        assertOrderVisible(actor, order);

        return NextResponse.json({ order });

    } catch (err: unknown) {
        return handleRouteError(err);
    }
}