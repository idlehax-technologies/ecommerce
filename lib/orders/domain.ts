import { randomUUID } from "crypto";
import type { Order, OrderItem } from "@/types/order";
import type { OrderEvent } from "@/types/orderEvent";

import { saveOrder, getOrder, listOrdersByTenant } from "./storage";

import {
    OrderNotFoundError,
    EmptyOrderItemsError,
    InvalidOrderItemQuantityError,
    OrderTotalMismatchError,
    InvalidOrderTransitionError,
} from "./errors";

function validateOrderItems(items: OrderItem[]) {

    if (!items || items.length === 0) {
        throw new EmptyOrderItemsError();
    }

    for (const item of items) {
        if (item.quantity <= 0) {
            throw new InvalidOrderItemQuantityError();
        }
    }
}

function computeTotal(items: OrderItem[]): number {
    return items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
}

export function createOrder(
    tenantId: string,
    userId: string,
    items: OrderItem[]
): { order: Order; event: OrderEvent } {

    validateOrderItems(items);

    const computedTotal = computeTotal(items);

    if (computedTotal <= 0) {
        throw new OrderTotalMismatchError();
    }

    const order: Order = {
        orderId: randomUUID(),
        tenantId,
        userId,
        items: [...items],   // snapshot protection
        total: computedTotal,
        currency: "INR",
        paymentMethod: "CASH",
        status: "RESERVED",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    saveOrder(order);

    return {
        order,
        event: { type: "OrderCreated", order }
    };
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

export function listTenantOrders(
    tenantId: string
): Order[] {

    return listOrdersByTenant(tenantId);
}

export function listTenantOrdersForUser(
    tenantId: string,
    userId: string
): Order[] {
    return listOrdersByTenant(tenantId).filter(
        (o) => o.userId === userId
    );
}

/**
 * Lifecycle transition engine
 */

function transition(
    order: Order,
    expected: Order["status"],
    to: Order["status"]
) {

    if (order.status !== expected) {
        throw new InvalidOrderTransitionError(order.status, to);
    }

    const allowed: Record<Order["status"], Order["status"][]> = {
        RESERVED: ["PAID", "CANCELLED", "EXPIRED"],
        PAID: ["PICKED_UP", "REFUNDED"], // ✅ NEW
        PICKED_UP: [],
        CANCELLED: [],
        EXPIRED: [],
        REFUNDED: [], // ✅ NEW
    };

    if (!allowed[expected].includes(to)) {
        throw new InvalidOrderTransitionError(expected, to);
    }

    order.status = to;
    order.updatedAt = new Date().toISOString();

    saveOrder(order);
}

export function markOrderPaid(
    tenantId: string,
    orderId: string,
    method: Order["paymentMethod"]
) {
    const order = getTenantOrder(tenantId, orderId);

    order.paymentMethod = method;

    transition(order, "RESERVED", "PAID");

    return {
        order,
        event: undefined, // ✅ NO EVENT HERE
    };
}

export function cancelOrder(
    tenantId: string,
    orderId: string
): { order: Order; event: OrderEvent } {

    const order = getTenantOrder(tenantId, orderId);

    transition(order, "RESERVED", "CANCELLED");

    return {
        order,
        event: { type: "OrderCancelled", order }
    };
}

export function expireOrder(
    tenantId: string,
    orderId: string
) {

    const order = getTenantOrder(tenantId, orderId);

    transition(order, "RESERVED", "EXPIRED");

    return {
        order,
        event: { type: "OrderExpired", order }
    };
}

export function markOrderPickedUp(
    tenantId: string,
    orderId: string
) {

    const order = getTenantOrder(tenantId, orderId);

    transition(order, "PAID", "PICKED_UP");

    return {
        order,
        event: { type: "OrderPickedUp", order }
    };
}

export function refundOrder(
    tenantId: string,
    orderId: string
) {
    const order = getTenantOrder(tenantId, orderId);

    transition(order, "PAID", "REFUNDED");

    return {
        order,
        event: { type: "OrderRefunded", order }
    };
}