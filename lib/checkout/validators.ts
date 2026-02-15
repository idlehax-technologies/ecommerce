// lib/checkout/validators.ts

import type { CheckoutRequest } from "@/types/checkout";
import { CheckoutInvalidInputError } from "./errors";

export function assertCheckoutRequest(
    body: unknown
): asserts body is CheckoutRequest {
    if (!body || typeof body !== "object") {
        throw new CheckoutInvalidInputError();
    }

    const b = body as CheckoutRequest;

    if (!Array.isArray(b.items) || b.items.length === 0) {
        throw new CheckoutInvalidInputError("Items are required");
    }

    for (const item of b.items) {
        if (typeof item.productId !== "string") {
            throw new CheckoutInvalidInputError("Invalid productId");
        }

        if (
            typeof item.quantity !== "number" ||
            !Number.isInteger(item.quantity) ||
            item.quantity <= 0
        ) {
            throw new CheckoutInvalidInputError("Invalid quantity");
        }
    }
}
