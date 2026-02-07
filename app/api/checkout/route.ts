import { NextResponse } from "next/server";

import type {
    CheckoutRequest,
    CheckoutResponse,
} from "@/types/checkout";

import { getUserFromRequest } from "@/lib/auth";

import { assertCheckoutRequest } from "@/lib/checkout/validators";
import { mapCheckoutDTOToInput } from "@/lib/checkout/mappers";
import { processCheckout } from "@/lib/checkout/domain";
import { CheckoutError } from "@/lib/checkout/errors";


// Route = HTTP glue only
export async function POST(req: Request) {
    try {
        // ---------------------------
        // 1. Auth (transport boundary)
        // ---------------------------
        const user = await getUserFromRequest();

        if (!user) {
            const response: CheckoutResponse = {
                success: false,
                errorCode: "UNAUTHORIZED",
                message: "Please login first",
            };

            return NextResponse.json(response, { status: 401 });
        }

        // ---------------------------
        // 2. Parse JSON
        // ---------------------------
        const body: unknown = await req.json();

        // ---------------------------
        // 3. Validate shape (syntax)
        // ---------------------------
        assertCheckoutRequest(body);

        // Now body is typed as CheckoutRequest
        const dto: CheckoutRequest = body;

        // ---------------------------
        // 4. Map transport → domain
        // ---------------------------
        const input = mapCheckoutDTOToInput(dto, {
            userId: user.userId,
            tenantId: user.tenantId,
        });

        // ---------------------------
        // 5. Domain logic (real rules)
        // ---------------------------
        const result = await processCheckout(input);

        // ---------------------------
        // 6. Success response
        // ---------------------------
        const response: CheckoutResponse = {
            success: true,
            orderId: result.orderId,
            message: "Order placed successfully",
        };

        return NextResponse.json(response, { status: 200 });

    } catch (e) {
        // ---------------------------
        // 7. Domain/validation errors
        // ---------------------------
        if (e instanceof CheckoutError) {
            const response: CheckoutResponse = {
                success: false,
                errorCode: "CHECKOUT_FAILED",
                message: e.message,
            };

            return NextResponse.json(response, { status: 400 });
        }

        // ---------------------------
        // 8. Unexpected errors
        // ---------------------------
        console.error("Checkout route crash:", e);

        const response: CheckoutResponse = {
            success: false,
            errorCode: "SERVER_ERROR",
            message: "Something went wrong",
        };

        return NextResponse.json(response, { status: 500 });
    }
}
