import { randomUUID } from "crypto";
import type { Order, OrderItem } from "@/types/order";
import { saveOrder, getOrder, listOrdersByTenant } from "./storage";
import { OrderNotFoundError } from "./errors";

export function createOrder(
    tenantId: string,
    userId: string,
    items: OrderItem[]
): Order {

    const total = items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
    );

    const order: Order = {
        orderId: randomUUID(),
        tenantId,
        userId,
        items,
        total,
        currency: "INR",
        paymentMode: "CASH",
        status: "RESERVED",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    saveOrder(order);
    return order;
}

export function getTenantOrder(
    tenantId: string,
    orderId: string
): Order {
    const order = getOrder(orderId);

    if (!order || order.tenantId !== tenantId) {
        throw new OrderNotFoundError();
    }
    return order;
}

export function listTenantOrders(tenantId: string): Order[] {
    return listOrdersByTenant(tenantId);
}