import * as cartDomain from "@/lib/cart/domain";
import * as ordersDomain from "@/lib/orders/domain";
import * as tenantInventoryDomain from "@/lib/tenantInventory/domain";

import { cartItemToOrderItem } from "@/lib/orders/mappers";
import { requireCartNotEmpty } from "./guards";

import type { CheckoutInput } from "@/types/checkout";
import type { Order } from "@/types/order";
import type { DomainEvent } from "@/types/domainEvent";

/**
 * CHECKOUT APPLICATION SERVICE
 *
 * Responsibilities:
 * - orchestrate cart → order flow
 * - reserve inventory BEFORE order creation
 * - rollback on failure
 * - clear cart AFTER success
 *
 * MUST NOT:
 * - execute side-effects (events, audit, reactions)
 * - bypass domain invariants
 *
 * Event execution is delegated to route → dispatcher
 */

export async function executeCheckout(
    input: CheckoutInput
): Promise<{ order: Order; event: DomainEvent }> {

    const actor = { tenantId: input.tenantId } as any;

    // STEP 1 — Load cart
    const cart = cartDomain.getCart(actor);

    requireCartNotEmpty(cart);

    const orderItems = cart.items.map(cartItemToOrderItem);

    // STEP 2 — Reserve inventory BEFORE order creation
    for (const item of orderItems) {
        tenantInventoryDomain.reserveStock(
            input.tenantId,
            item.productId,
            item.quantity
        );
    }

    let result: { order: Order; event: DomainEvent };

    try {
        // STEP 3 — Create order AFTER inventory secured
        result = ordersDomain.createOrder(
            input.tenantId,
            input.userId,
            orderItems
        );

    } catch (err) {

        // STEP 4 — Rollback reservation on failure
        for (const item of orderItems) {
            tenantInventoryDomain.releaseStock(
                input.tenantId,
                item.productId,
                item.quantity
            );
        }

        throw err;
    }

    // STEP 5 — Clear cart AFTER successful order creation
    cartDomain.clearCart(actor);

    // 🚨 CRITICAL: DO NOT execute event here
    // Event execution must happen in route via dispatchEvent

    return result;
}