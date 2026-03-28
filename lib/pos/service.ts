import * as ordersDomain from "@/lib/orders/domain";
import * as tenantInventoryDomain from "@/lib/tenantInventory/domain";
import * as paymentsDomain from "@/lib/payments/domain";

import { handleOrderEvent } from "@/lib/orders/reactions";
import { getProduct } from "@/lib/products/domain";

import type { OrderItem } from "@/types/order";

export type POSItemInput = {
    productId: string;
    quantity: number;
};

export type POSInput = {
    tenantId: string;
    staffId: string;
    items: POSItemInput[];
    paymentMethod?: "CASH" | "UPI" | "CARD" | "NET_BANKING";
};

export async function executePOS(input: POSInput) {
    if (!input.items.length) {
        throw new Error("POS requires items");
    }

    const orderItems: OrderItem[] = [];

    // 🔥 Build snapshot items
    for (const item of input.items) {
        const product = await getProduct(item.productId);

        orderItems.push({
            productId: product.productId,
            name: product.title,
            price: product.price,
            quantity: item.quantity,
        });
    }

    // 🔥 Reserve stock first
    for (const item of orderItems) {
        tenantInventoryDomain.reserveStock(
            input.tenantId,
            item.productId,
            item.quantity
        );
    }

    let order;

    try {
        const result = ordersDomain.createOrder(
            input.tenantId,
            input.staffId,
            orderItems
        );

        order = {
            ...result.order,
            placedByStaffId: input.staffId,
        };

        await handleOrderEvent(result.event);

    } catch (err) {
        // rollback reservations
        for (const item of orderItems) {
            tenantInventoryDomain.releaseStock(
                input.tenantId,
                item.productId,
                item.quantity
            );
        }
        throw err;
    }

    // 🔥 Optional immediate payment
    if (input.paymentMethod) {
        const paymentResult = paymentsDomain.recordPayment(
            input.tenantId,
            order.orderId,
            input.paymentMethod
        );

        await handleOrderEvent({
            type: "OrderPaid",
            order: paymentResult.order,
            payment: paymentResult.payment,
        });

        return paymentResult.order;
    }

    return order;
}