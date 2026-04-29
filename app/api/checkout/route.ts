import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { requireTenant } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

import { assertCheckoutDTO } from "@/lib/checkout/validators";
import { toCheckoutInput } from "@/lib/checkout/mappers";
import { executeCheckout } from "@/lib/checkout/service";

import { dispatchEvent } from "@/lib/events/dispatcher";

export async function POST(req: Request) {
    try {
        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });

        const actor = requireTenant(user);

        const body: unknown = await req.json();

        assertCheckoutDTO(body);

        const input = toCheckoutInput(actor.userId, actor.tenantId, body);

        const result = await executeCheckout(input);

        await dispatchEvent(result.event, { actorId: actor.userId });

        return NextResponse.json({
            success: true,
            orderId: result.order.orderId,
            message: "Order placed successfully",
        });

    } catch (err) {
        return handleRouteError(err);
    }
}