import { randomUUID } from "crypto";
import type { DomainEvent } from "@/types/domainEvent";
import type { Order, OrderItem } from "@/types/order";

import {
    saveOrder,
    getOrder,
    listOrdersByTenant
} from "./storage";

import {
    OrderNotFoundError,
    EmptyOrderItemsError,
    InvalidOrderItemQuantityError,
    OrderTotalMismatchError,
    InvalidOrderTransitionError,
} from "./errors";

/* ---------------- VALIDATION ---------------- */

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

/* ---------------- TRANSITION ---------------- */

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
        PAID: ["PICKED_UP", "REFUNDED"],
        PICKED_UP: [],
        CANCELLED: [],
        EXPIRED: [],
        REFUNDED: [],
    };

    if (!allowed[expected].includes(to)) {
        throw new InvalidOrderTransitionError(expected, to);
    }

    const from = order.status;

    order.status = to;
    order.updatedAt = new Date().toISOString();

    saveOrder(order);

    return { from, to };
}

/* ---------------- CREATE ---------------- */

export function createOrder(
    tenantId: string,
    userId: string,
    items: OrderItem[]
): { order: Order; event: DomainEvent } {

    validateOrderItems(items);

    const total = computeTotal(items);

    if (total <= 0) {
        throw new OrderTotalMismatchError();
    }

    const now = new Date().toISOString();

    const order: Order = {
        orderId: randomUUID(),
        tenantId,
        userId,
        items: [...items],
        total,
        currency: "INR",
        paymentMethod: "CASH", // or your default
        status: "RESERVED",
        createdAt: now,
        updatedAt: now,
    };

    saveOrder(order);

    return {
        order,
        event: {
            type: "OrderCreated",
            order
        }
    };
}

/* ---------------- READ ---------------- */

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
    tenantId: string,
    limit?: number
): Order[] {
    const all = listOrdersByTenant(tenantId);

    return limit ? all.slice(0, limit) : all;
}

/* ---------------- MUTATIONS ---------------- */

/**
 * 🔴 IMPORTANT
 * Payment domain must pass payment object
 */
export function markOrderPaid(
    tenantId: string,
    orderId: string,
    method: Order["paymentMethod"],
): { order: Order; event: DomainEvent } {

    const order = getTenantOrder(tenantId, orderId);

    const { from, to } = transition(order, "RESERVED", "PAID");

    order.paymentMethod = method;

    return {
        order,
        event: {
            type: "OrderPaid",
            order,
            from,
            to
        }
    };
}

export function cancelOrder(
    tenantId: string,
    orderId: string
): { order: Order; event: DomainEvent } {

    const order = getTenantOrder(tenantId, orderId);

    const { from, to } = transition(order, "RESERVED", "CANCELLED");

    return {
        order,
        event: {
            type: "OrderCancelled",
            order,
            from,
            to
        }
    };
}

export function expireOrder(
    tenantId: string,
    orderId: string
): { order: Order; event: DomainEvent } {

    const order = getTenantOrder(tenantId, orderId);

    const { from, to } = transition(order, "RESERVED", "EXPIRED");

    return {
        order,
        event: {
            type: "OrderExpired",
            order,
            from,
            to
        }
    };
}

export function markOrderPickedUp(
    tenantId: string,
    orderId: string
): { order: Order; event: DomainEvent } {

    const order = getTenantOrder(tenantId, orderId);

    const { from, to } = transition(order, "PAID", "PICKED_UP");

    return {
        order,
        event: {
            type: "OrderPickedUp",
            order,
            from,
            to
        }
    };
}

export function refundOrder(
    tenantId: string,
    orderId: string
): { order: Order; event: DomainEvent } {

    const order = getTenantOrder(tenantId, orderId);

    const { from, to } = transition(order, "PAID", "REFUNDED");

    return {
        order,
        event: {
            type: "OrderRefunded",
            order,
            from,
            to
        }
    };
}