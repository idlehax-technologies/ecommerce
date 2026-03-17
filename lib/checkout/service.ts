import * as cartDomain from "@/lib/cart/domain";
import * as ordersDomain from "@/lib/orders/domain";
import * as tenantInventoryDomain from "@/lib/tenantInventory/domain";

import { cartItemToOrderItem } from "@/lib/orders/mappers";
import { requireCartNotEmpty } from "./guards";

import { handleOrderEvent } from "@/lib/orders/reactions";

import type { CheckoutInput } from "@/types/checkout";
import type { Order } from "@/types/order";

export async function executeCheckout(
    input: CheckoutInput
): Promise<Order> {

    const actor = { tenantId: input.tenantId } as any;

    const cart = cartDomain.getCart(actor);

    requireCartNotEmpty(cart);

    const orderItems = cart.items.map(cartItemToOrderItem);

    /**
     * STEP 1
     * Reserve inventory BEFORE creating order
     */

    for (const item of orderItems) {

        tenantInventoryDomain.reserveStock(
            input.tenantId,
            item.productId,
            item.quantity
        );

    }

    /**
     * STEP 2
     * Create order only after inventory secured
     */

    let order;

    try {

        const result = ordersDomain.createOrder(
            input.tenantId,
            input.userId,
            orderItems
        );

        order = result.order;

        /**
         * Lifecycle reactions now handled
         * by the orders module
         */

        await handleOrderEvent(result.event);

    } catch (err) {

        /**
         * Rollback reservations if order creation fails
         */

        for (const item of orderItems) {

            tenantInventoryDomain.releaseStock(
                input.tenantId,
                item.productId,
                item.quantity
            );

        }

        throw err;
    }

    /**
     * STEP 3
     * Clear cart
     */

    cartDomain.clearCart(actor);

    return order;
}