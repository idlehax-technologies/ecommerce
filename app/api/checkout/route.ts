import { NextResponse } from "next/server";
import type { CheckoutRequest, CheckoutResponse } from "@/types/checkout";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as CheckoutRequest;
        const { items, total } = body;

        // basic validation
        if (!items || items.length === 0) {
            const response: CheckoutResponse = {
                success: false,
                errorCode: "EMPTY_CART",
                message: "Cart is empty",
            };

            return NextResponse.json(response, { status: 400 });
        }

        // 🔧 TEMP: simulate payment delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // 🔧 TEMP: simulate success / failure
        const isSuccess = Math.random() > 0;

        if (!isSuccess) {
            const response: CheckoutResponse = {
                success: false,
                errorCode: "PAYMENT_FAILED",
                message: "Payment could not be completed",
            };

            return NextResponse.json(response, { status: 402 });
        } else {
            // success response
            const response: CheckoutResponse = {
                success: true,
                orderId: `ORD_${Date.now()}`,
                message: "Order placed successfully",
            };

            return NextResponse.json(response);
        }
    } catch (error) {
        const response: CheckoutResponse = {
            success: false,
            errorCode: "SERVER_ERROR",
            message: "Something went wrong",
        };

        return NextResponse.json(response, { status: 500 });
    }
}
