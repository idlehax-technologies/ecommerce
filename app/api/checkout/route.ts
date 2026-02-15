import { NextResponse } from "next/server";

import type {
    CheckoutRequest,
    CheckoutResponse,
} from "@/types/checkout";

import { getUserFromRequest } from "@/lib/auth";
import { requireAuth, requireTenant } from "@/lib/auth/guards";

import { assertCheckoutRequest } from "@/lib/checkout/validators";
import { mapCheckoutDTOToInput } from "@/lib/checkout/mappers";
import { processCheckout } from "@/lib/checkout/domain";

import { handleRouteError } from "@/lib/http/handleRouteError";


// Route = HTTP orchestration only
export async function POST(req: Request) {
    try {
        // ---------------------------------
        // 1. Resolve authenticated identity
        // ---------------------------------
        const rawUser = await getUserFromRequest();
        const user = requireTenant(rawUser);

        // ---------------------------------
        // 2. Parse request body (unknown)
        // ---------------------------------
        const body: unknown = await req.json();

        // ---------------------------------
        // 3. Validate transport DTO shape
        // ---------------------------------
        assertCheckoutRequest(body);
        const dto: CheckoutRequest = body;

        // ---------------------------------
        // 4. Map DTO → domain input
        // Inject server-owned identity fields
        // ---------------------------------
        const input = mapCheckoutDTOToInput(dto, {
            userId: user.userId,
            tenantId: user.tenantId!,
        });

        // ---------------------------------
        // 5. Execute business logic
        // ---------------------------------
        const order = await processCheckout(input);

        // ---------------------------------
        // 6. Return protocol response
        // ---------------------------------
        const response: CheckoutResponse = {
            success: true,
            orderId: order.orderId,
            message: "Order placed successfully",
        };

        return NextResponse.json(response, { status: 200 });

    } catch (err: unknown) {
        return handleRouteError(err);
    }
}
