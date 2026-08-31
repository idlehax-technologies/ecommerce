import { randomUUID } from "crypto";
import type { DomainEvent } from "@/types/domainEvent";

import type {
    Order,
    ItemSnapshot,
    SellerSnapshot,
    CustomerSnapshot,
} from "@/types/order";

import { orderStore } from "./storage";

import {
    OrderNotFoundError,
    EmptyOrderItemsError,
    InvalidOrderItemQuantityError,
    OrderTotalMismatchError,
    InvalidOrderTransitionError,
} from "./errors";

import {
    assertInvoiceState,
    assertUniqueInvoiceNumber,
    assertUniqueOrderNumber,
} from "./guards";

import { getOrderTotals }
    from "@/lib/calculations/pricing";

import { PaymentMethod } from "@/types/payment";

export const ORDER_EXPIRY_MS = 24 * 60 * 60 * 1000;

function now(): string {
    return new Date().toISOString();
}

function validateOrderItems(items: ItemSnapshot[]): void {
    if (!items || items.length === 0) {
        throw new EmptyOrderItemsError();
    }

    for (const item of items) {
        if (item.quantity <= 0) {
            throw new InvalidOrderItemQuantityError();
        }
    }
}

function generateOrderNumber(): string {
    return `ORD-${randomUUID()
        .replace(/-/g, "")
        .slice(0, 8)
        .toUpperCase()}`;
}

function getFinancialYear(
    date: Date
): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const startYear =
        month >= 4
            ? year
            : year - 1;

    const endYear =
        startYear + 1;

    return `FY${String(startYear).slice(-2)}${String(endYear).slice(-2)}`;
}

function getInvoiceSequence(
    invoiceNumber: string
): number {
    const [, , sequence] = invoiceNumber.split("-");

    return Number(sequence);
}

function getNextInvoiceSequence(
    orders: Order[],
    financialYear: string
): number {
    const maxSequence =
        orders
            .filter((order) => order.invoiceNumber?.startsWith(`INV-${financialYear}-`))
            .map((order) => getInvoiceSequence(order.invoiceNumber!))
            .reduce((max, current) => Math.max(max, current), 0);

    return maxSequence + 1;
}

function generateInvoiceNumber(
    financialYear: string,
    sequence: number
): string {
    return `INV-${financialYear}-${String(sequence).padStart(5, "0")}`;
}

/* ---------------- TRANSITIONS ---------------- */

const ALLOWED_TRANSITIONS: Record<
    Order["status"],
    Order["status"][]
> = {
    RESERVED: ["PAID", "CANCELLED", "EXPIRED"],
    PAID: ["PICKED_UP", "REFUNDED"],
    PICKED_UP: [],
    CANCELLED: [],
    EXPIRED: [],
    REFUNDED: [],
};

async function transition(
    order: Order,
    expected: Order["status"],
    to: Order["status"],
    mutate?: () => void
): Promise<{
    from: Order["status"];
    to: Order["status"];
}> {
    if (order.status !== expected) {
        throw new InvalidOrderTransitionError(
            order.status,
            to
        );
    }

    if (
        !ALLOWED_TRANSITIONS[expected]
            .includes(to)
    ) {
        throw new InvalidOrderTransitionError(
            expected,
            to
        );
    }

    const from = order.status;

    order.status = to;

    mutate?.();

    order.updatedAt = now();

    await orderStore.save(order);

    return { from, to };
}

/* ---------------- CREATE ---------------- */

export async function createOrder(
    tenantId: string,
    userId: string,
    seller: SellerSnapshot,
    customer: CustomerSnapshot,
    items: ItemSnapshot[],
    placedByStaffId?: string
): Promise<{
    order: Order;
    event: DomainEvent;
}> {
    validateOrderItems(items);

    const { payableTotal } = getOrderTotals(items);

    if (payableTotal <= 0) {
        throw new OrderTotalMismatchError();
    }

    const orders = await listOrders();
    const orderNumber = generateOrderNumber();
    assertUniqueOrderNumber(orders, orderNumber);

    const timestamp = now();

    const order: Order = {
        orderId: randomUUID(),
        orderNumber,

        tenantId,
        userId,

        seller,
        customer,

        placedByStaffId,

        items: [...items],

        total: payableTotal,
        currency: "INR",

        status: "RESERVED",

        createdAt: timestamp,
        updatedAt: timestamp,
    };

    await orderStore.save(order);

    return {
        order,
        event: {
            type: "OrderCreated",
            order,
        },
    };
}

/* ---------------- READ ---------------- */

export async function getTenantOrder(
    tenantId: string,
    orderId: string
): Promise<Order> {
    const order = await orderStore.get(orderId);

    if (!order || order.tenantId !== tenantId) {
        throw new OrderNotFoundError();
    }

    return order;
}

export async function listOrders(
    limit?: number
): Promise<Order[]> {
    const all = await orderStore.listAll();

    return limit ? all.slice(0, limit) : all;
}

export async function listTenantOrders(
    tenantId: string,
    limit?: number
): Promise<Order[]> {
    const all = await orderStore.listByTenant(tenantId);

    return limit ? all.slice(0, limit) : all;
}

/* ---------------- MUTATIONS ---------------- */

export async function markOrderPaid(
    tenantId: string,
    orderId: string,
    method: PaymentMethod,
): Promise<{
    order: Order;
    event: DomainEvent;
}> {
    const order = await getTenantOrder(tenantId, orderId);
    const orders = await listTenantOrders(tenantId);

    assertInvoiceState(order);

    const issuedAt =
        !order.invoiceNumber
            ? new Date()
            : undefined;

    const financialYear =
        issuedAt
            ? getFinancialYear(issuedAt)
            : undefined;

    const sequence =
        financialYear
            ? getNextInvoiceSequence(orders, financialYear)
            : undefined;

    const invoiceNumber =
        financialYear && sequence
            ? generateInvoiceNumber(financialYear, sequence)
            : undefined;

    if (invoiceNumber) {
        assertUniqueInvoiceNumber(orders, invoiceNumber);
    }

    const { from, to } =
        await transition(
            order,
            "RESERVED",
            "PAID",
            () => {
                order.paymentMethod = method;

                if (invoiceNumber && issuedAt) {
                    order.invoiceNumber = invoiceNumber;
                    order.invoiceIssuedAt = issuedAt.toISOString();
                }
            }
        );

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

export async function cancelOrder(
    tenantId: string,
    orderId: string
): Promise<{ order: Order; event: DomainEvent }> {

    const order = await getTenantOrder(tenantId, orderId);

    const { from, to } = await transition(order, "RESERVED", "CANCELLED");

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

export async function expireOrder(
    tenantId: string,
    orderId: string
): Promise<{
    order: Order;
    event: DomainEvent;
} | null> {

    const order = await getTenantOrder(tenantId, orderId);

    if (order.status !== "RESERVED") {
        return null;
    }

    const now = Date.now();
    const created = new Date(order.createdAt).getTime();

    if (now - created < ORDER_EXPIRY_MS) {
        return null;
    }

    const { from, to } = await transition(order, "RESERVED", "EXPIRED");

    return {
        order,
        event: {
            type: "OrderExpired",
            order,
            from,
            to,
        },
    };
}

export async function markOrderPickedUp(
    tenantId: string,
    orderId: string
): Promise<{ order: Order; event: DomainEvent }> {

    const order = await getTenantOrder(tenantId, orderId);

    const { from, to } = await transition(order, "PAID", "PICKED_UP");

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

export async function refundOrder(
    tenantId: string,
    orderId: string
): Promise<{ order: Order; event: DomainEvent }> {

    const order = await getTenantOrder(tenantId, orderId);

    const { from, to } = await transition(order, "PAID", "REFUNDED");

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