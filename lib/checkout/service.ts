import { getProfile } from "@/lib/profiles/domain";
import { getTenant } from "@/lib/tenants/domain";
import { getActiveProduct } from "@/lib/products/domain";

import * as cartDomain from "@/lib/cart/domain";
import * as ordersDomain from "@/lib/orders/domain";
import * as tenantInventoryDomain from "@/lib/tenantInventory/domain";

import { requireCartNotEmpty } from "./guards";

import {
    toCustomerSnapshot,
    toItemSnapshot,
    toSellerSnapshot
} from "../orders/mappers";

import type { Order } from "@/types/order";
import type { DomainEvent } from "@/types/domainEvent";

import { ProfileNotFoundError } from "../profiles/errors";

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

    const profile = getProfile(userId);

    if (!profile) {
        throw new ProfileNotFoundError();
    }

    const tenant = await getTenant(tenantId);

    const seller = toSellerSnapshot(tenant);

    const customer = toCustomerSnapshot(profile);

    const items =
        await Promise.all(
            cart.items.map(
                async (item) => {
                    const product = await getActiveProduct(item.productId);

                    return toItemSnapshot(product, item.quantity);
                }
            )
        );

    // STEP 2 — Reserve inventory BEFORE order creation

    for (const item of items) {

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

        result = await ordersDomain.createOrder(
            tenantId,
            userId,
            seller,
            customer,
            items
        );

    } catch (err: unknown) {

        // STEP 4 — Rollback reservation on failure

        for (const item of items) {

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