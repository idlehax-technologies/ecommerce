import { randomUUID } from "crypto";
import type { DomainEvent } from "@/types/domainEvent";

import type {
    Order,
    ItemSnapshot,
    SellerSnapshot,
    CustomerSnapshot,
} from "@/types/order";

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

import { PaymentMethod } from "@/types/payment";
import { assertInvoiceState, assertUniqueInvoiceNumber, assertUniqueOrderNumber } from "./guards";

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

function computeTotal(items: ItemSnapshot[]): number {
    return items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
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

function transition(
    order: Order,
    expected: Order["status"],
    to: Order["status"],
    mutate?: () => void
): {
    from: Order["status"];
    to: Order["status"];
} {
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

    saveOrder(order);

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

    const total = computeTotal(items);
    if (total <= 0) {
        throw new OrderTotalMismatchError();
    }

    const orders = await listTenantOrders(tenantId);
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

        total,
        currency: "INR",

        status: "RESERVED",

        createdAt: timestamp,
        updatedAt: timestamp,
    };

    saveOrder(order);

    return {
        order,
        event: {
            type: "OrderCreated",
            order,
        },
    };
}

/* ---------------- READ (Tenant Scoped) ---------------- */

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

export async function listTenantOrders(
    tenantId: string,
    limit?: number
): Promise<Order[]> {
    const all = listOrdersByTenant(tenantId);

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
    const order = getTenantOrder(tenantId, orderId);
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
        transition(
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