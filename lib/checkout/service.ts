import * as cartDomain from "@/lib/cart/domain";
import * as ordersDomain from "@/lib/orders/domain";
import * as tenantInventoryDomain from "@/lib/tenantInventory/domain";

import { cartItemToOrderItem } from "@/lib/orders/mappers";
import { requireCartNotEmpty } from "./guards";

import type { CheckoutInput } from "@/types/checkout";
import type { Order } from "@/types/order";
import type { OrderEvent } from "@/types/orderEvent";

/**
 * Checkout application service
 *
 * Orchestrates the transaction:
 *
 * Cart → Order Aggregate → Inventory Reservation → Cart Clear
 */
export async function executeCheckout(
    input: CheckoutInput
): Promise<Order> {

    /**
     * Actor context
     * (kept consistent with existing cart domain API)
     */
    const actor = { tenantId: input.tenantId } as any;

    /**
     * Retrieve cart
     */
    const cart = cartDomain.getCart(actor);

    requireCartNotEmpty(cart);

    /**
     * Convert cart items → order snapshot items
     */
    const orderItems = cart.items.map(cartItemToOrderItem);

    /**
     * Create order aggregate
     */
    const { order, event } = ordersDomain.createOrder(
        input.tenantId,
        input.userId,
        orderItems
    );

    /**
     * React to domain event
     */
    await handleOrderEvent(event);

    /**
     * Reserve tenant inventory
     *
     * Domain invariant:
     * inventory check + mutation must occur inside the domain
     */
    for (const item of order.items) {

        tenantInventoryDomain.reserveStock(
            input.tenantId,
            item.productId,
            item.quantity
        );

    }

    /**
     * Clear cart after successful checkout
     */
    cartDomain.clearCart(actor);

    return order;
}


/**
 * Application-layer reactions to order events
 *
 * The orders domain emits events.
 * Application services decide how to react.
 *
 * This prevents the order domain from depending on
 * inventory, payments, notifications, etc.
 */
async function handleOrderEvent(
    event: OrderEvent
): Promise<void> {

    switch (event.type) {

        case "OrderCreated":
            /**
             * Future reactions:
             *
             * analytics
             * audit logs
             */
            break;

        case "OrderPaid":
            /**
             * Future reactions:
             *
             * commit inventory reservation
             * payment recording
             */
            break;

        case "OrderCancelled":
            /**
             * Future reactions:
             *
             * release inventory
             */
            break;

        case "OrderExpired":
            /**
             * Future reactions:
             *
             * release reservation
             */
            break;

        case "OrderPickedUp":
            /**
             * Future reactions:
             *
             * fulfillment completion
             */
            break;
    }
}