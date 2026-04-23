import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/auth";
import { requireTenant, requireMembershipRole } from "@/lib/auth/guards";

import { handleRouteError } from "@/lib/http/handleRouteError";

import { executePOS } from "@/lib/pos/service";

export async function POST(req: Request) {
    try {
        const rawUser = await getUserFromRequest();

        requireMembershipRole(rawUser, ["staff"]);
        const actor = requireTenant(rawUser);

        const body = await req.json();

        const order = await executePOS({
            tenantId: actor.tenantId,
            staffId: actor.userId,
            items: body.items,
            paymentMethod: body.paymentMethod,
        });

        return NextResponse.json({
            success: true,
            orderId: order.orderId,
        });
    } catch (err) {
        return handleRouteError(err);
    }
}