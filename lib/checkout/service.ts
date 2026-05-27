import * as cartDomain from "@/lib/cart/domain";
import * as ordersDomain from "@/lib/orders/domain";
import * as tenantInventoryDomain from "@/lib/tenantInventory/domain";

import { cartItemToOrderItem } from "@/lib/orders/mappers";
import { requireCartNotEmpty } from "./guards";

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
    tenantId: string,
    userId: string
): Promise<{
    order: Order;
    event: DomainEvent;
}> {

    // STEP 1 — Load cart

    const cart = cartDomain.getUserCart(
        tenantId,
        userId
    );

    requireCartNotEmpty(cart);

    const orderItems = cart.items.map(
        cartItemToOrderItem
    );

    // STEP 2 — Reserve inventory BEFORE order creation

    for (const item of orderItems) {

        await tenantInventoryDomain.reserveStock(
            tenantId,
            item.productId,
            item.quantity
        );
    }

    let result: {
        order: Order;
        event: DomainEvent;
    };

    try {

        // STEP 3 — Create order AFTER inventory secured

        result = ordersDomain.createOrder(
            tenantId,
            userId,
            orderItems
        );

    } catch (err: unknown) {

        // STEP 4 — Rollback reservation on failure

        for (const item of orderItems) {

            await tenantInventoryDomain.releaseStock(
                tenantId,
                item.productId,
                item.quantity
            );
        }

        throw err;
    }

    // STEP 5 — Clear cart AFTER successful order creation

    cartDomain.clearCart(
        tenantId,
        userId
    );

    // 🚨 CRITICAL: DO NOT execute event here
    // Event execution must happen in route via dispatchEvent

    return result;
}