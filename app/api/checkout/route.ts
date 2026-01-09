import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { items, total } = body;

        // basic validation
        if (!items || items.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    errorCode: "EMPTY_CART",
                    message: "Cart is empty",
                },
                { status: 400 }
            );
        }

        // 🔧 TEMP: simulate payment delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // 🔧 TEMP: simulate success / failure
        const isSuccess = Math.random() > 0;

        if (!isSuccess) {
            return NextResponse.json(
                {
                    success: false,
                    errorCode: "PAYMENT_FAILED",
                    message: "Payment could not be completed",
                },
                {
                    status: 402
                }
            );
        }

        // success response
        return NextResponse.json(
            {
                success: true,
                orderId: `ORD_${Date.now()}`,
                message: "Order placed successfully",
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                errorCode: "SERVER_ERROR",
                message: "Something went wrong",
            },
            {
                status: 500
            }
        );
    }
}
