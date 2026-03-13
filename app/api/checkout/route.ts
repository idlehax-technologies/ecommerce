import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { requireTenant } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

import { assertCheckoutDTO } from "@/lib/checkout/validators";
import { toCheckoutInput } from "@/lib/checkout/mappers";
import { executeCheckout } from "@/lib/checkout/service";

export async function POST(req: Request) {
    try {
        const rawUser = await getUserFromRequest();
        const actor = requireTenant(rawUser);

        const body: unknown = await req.json();

        assertCheckoutDTO(body);

        const input = toCheckoutInput(actor.userId, actor.tenantId, body);

        const order = await executeCheckout(input);

        return NextResponse.json({
            success: true,
            orderId: order.orderId,
            message: "Order placed successfully",
        });

    } catch (err) {
        return handleRouteError(err);
    }
}