import type { CheckoutRequest } from "@/types/checkout";
import { CheckoutInvalidInputError } from "./errors";

export function assertCheckoutDTO(body: unknown): asserts body is CheckoutRequest {
    if (!body || typeof body !== "object") {
        throw new CheckoutInvalidInputError();
    }

    const b = body as CheckoutRequest;

    if (!Array.isArray(b.items) || b.items.length === 0) {
        throw new CheckoutInvalidInputError("Checkout requires items");
    }

    for (const item of b.items) {
        if (
            !item ||
            typeof item.productId !== "string" ||
            typeof item.quantity !== "number" ||
            item.quantity <= 0
        ) {
            throw new CheckoutInvalidInputError("Invalid checkout item");
        }
    }
}