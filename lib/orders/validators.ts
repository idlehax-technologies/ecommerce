import type { CreatePOSOrderDTO } from "@/types/order";
import { PaymentMethod } from "@/types/payment";

import {
    InvalidOrderItemQuantityError,
} from "./errors";

const PAYMENT_METHODS: PaymentMethod[] = [
    "CASH",
    "UPI",
    "CARD",
    "NET_BANKING",
];

function isPaymentMethod(
    value: unknown
): value is PaymentMethod {
    return (
        typeof value === "string" &&
        PAYMENT_METHODS.includes(value as PaymentMethod)
    );
}

export function assertPayOrderDTO(
    body: unknown
): asserts body is { method: PaymentMethod } {
    if (
        typeof body !== "object" ||
        body === null
    ) {
        throw new Error("Invalid payment payload");
    }

    const obj = body as Record<string, unknown>;

    if (!isPaymentMethod(obj.method)) {
        throw new Error("Invalid payment method");
    }
}

export function assertCreatePOSOrderDTO(
    body: unknown
): asserts body is CreatePOSOrderDTO {
    if (
        typeof body !== "object" ||
        body === null
    ) {
        throw new Error("Invalid POS payload");
    }

    const obj = body as Record<string, unknown>;

    if (!Array.isArray(obj.items)) {
        throw new Error("Items must be an array");
    }

    for (const item of obj.items) {
        if (
            typeof item !== "object" ||
            item === null
        ) {
            throw new Error("Invalid POS item");
        }

        const row = item as Record<string, unknown>;

        if (
            typeof row.productId !== "string"
        ) {
            throw new Error("Invalid product ID");
        }

        if (
            typeof row.quantity !== "number"
        ) {
            throw new InvalidOrderItemQuantityError();
        }

        if (row.quantity <= 0) {
            throw new InvalidOrderItemQuantityError();
        }
    }

    if (
        "paymentMethod" in obj &&
        obj.paymentMethod !== undefined &&
        !isPaymentMethod(obj.paymentMethod)
    ) {
        throw new Error("Invalid payment method");
    }
}