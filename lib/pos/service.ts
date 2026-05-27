import * as ordersDomain from "@/lib/orders/domain";
import * as tenantInventoryDomain from "@/lib/tenantInventory/domain";
import * as paymentsDomain from "@/lib/payments/domain";

import { getProduct } from "@/lib/products/domain";

import type { Order, OrderItem } from "@/types/order";
import type { DomainEvent } from "@/types/domainEvent";
import { PaymentMethod } from "@/types/payment";

type POSItemInput = {
    productId: string;
    quantity: number;
};

type POSInput = {
    tenantId: string;
    staffId: string;
    items: POSItemInput[];
    paymentMethod?: PaymentMethod;
};

export async function executePOS(input: POSInput): Promise<{
    order: Order & { placedByStaffId: string };
    events: DomainEvent[];
}> {
    if (!input.items.length) {
        throw new Error("POS requires items");
    }

    const orderItems: OrderItem[] = [];

    // build snapshot
    for (const item of input.items) {
        const product = await getProduct(item.productId);

        orderItems.push({
            productId: product.productId,
            name: product.title,
            price: product.price,
            quantity: item.quantity,
        });
    }

    // reserve stock
    for (const item of orderItems) {
        await tenantInventoryDomain.reserveStock(
            input.tenantId,
            item.productId,
            item.quantity
        );
    }

    try {
        const { order, event: orderCreatedEvent } =
            ordersDomain.createOrder(
                input.tenantId,
                input.staffId,
                orderItems,
                input.staffId
            );

        const enrichedOrder: Order & { placedByStaffId: string } = {
            ...order,
            placedByStaffId: input.staffId,
        };

        const events: DomainEvent[] = [orderCreatedEvent];

        // payment flow (2-step)
        if (input.paymentMethod) {
            // STEP 1 — create payment (PENDING)
            paymentsDomain.recordPayment(
                input.tenantId,
                order.orderId,
                input.paymentMethod
            );

            // STEP 2 — confirm payment (returns BOTH events)
            const paymentResult = paymentsDomain.confirmPayment(
                input.tenantId,
                order.orderId
            );

            // include BOTH events
            events.push(...paymentResult.events);

            const enrichedPaidOrder: Order & { placedByStaffId: string } = {
                ...paymentResult.order,
                placedByStaffId: input.staffId,
            };

            return {
                order: enrichedPaidOrder,
                events,
            };
        }

        return {
            order: enrichedOrder,
            events,
        };

    } catch (err) {
        // rollback reservation
        for (const item of orderItems) {
            await tenantInventoryDomain.releaseStock(
                input.tenantId,
                item.productId,
                item.quantity
            );
        }
        throw err;
    }
}