import type {
    Cart,
    AddToCartDTO,
    UpdateCartItemDTO,
} from "@/types/cart";

import {
    CartItemNotFoundError,
    InvalidCartRequestError,
    InvalidProductIdError,
    InvalidQuantityError,
} from "./errors";

/* =========================================================
   Aggregate guards
   ========================================================= */

export function requireItem(cart: Cart, productId: string) {
    const item = cart.items.find((i) => i.productId === productId);
    if (!item) throw new CartItemNotFoundError();
    return item;
}

/* =========================================================
   DTO validation (transport shape)
   ========================================================= */

export function assertAddToCartDTO(
    body: unknown
): asserts body is AddToCartDTO {
    if (typeof body !== "object" || body === null) {
        throw new InvalidCartRequestError();
    }

    const b = body as Record<string, unknown>;

    if (typeof b.productId !== "string" || b.productId.trim() === "") {
        throw new InvalidProductIdError();
    }

    if (
        b.quantity !== undefined &&
        (typeof b.quantity !== "number" || b.quantity <= 0)
    ) {
        throw new InvalidQuantityError();
    }
}

export function assertUpdateCartItemDTO(
    body: unknown
): asserts body is UpdateCartItemDTO {
    if (typeof body !== "object" || body === null) {
        throw new InvalidCartRequestError();
    }

    const b = body as Record<string, unknown>;

    if (typeof b.quantity !== "number" || b.quantity < 0) {
        throw new InvalidQuantityError();
    }
}
