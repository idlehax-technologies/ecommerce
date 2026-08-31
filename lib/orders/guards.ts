import type { Order } from "@/types/order";
import type { MembershipActor } from "@/types/auth";

import { ForbiddenError } from "../auth/errors";
import {
    InvalidOrderInvoiceStateError,
    InvoiceNumberAlreadyExistsError,
    OrderNumberAlreadyExistsError,
} from "./errors";

function canViewOrder(
    actor: MembershipActor,
    order: Order
): boolean {
    if (
        order.tenantId !==
        actor.tenantId
    ) {
        return false;
    }
    if (
        actor.role === "customer" &&
        order.userId !== actor.userId
    ) {
        return false;
    }
    return true;
}

export function assertOrderVisible(
    actor: MembershipActor,
    order: Order
): void {
    if (!canViewOrder(actor, order)) {
        throw new ForbiddenError("Order access forbidden");
    }
}

export function filterVisibleOrders(
    actor: MembershipActor,
    orders: Order[]
): Order[] {
    return orders.filter((order) =>
        canViewOrder(actor, order)
    );
}

export function assertInvoiceState(
    order: Order
): void {
    if (
        !!order.invoiceNumber !==
        !!order.invoiceIssuedAt
    ) {
        throw new InvalidOrderInvoiceStateError();
    }
}

export function assertUniqueOrderNumber(
    orders: Order[],
    orderNumber: string
): void {
    const exists = orders.some(
        (order) => order.orderNumber === orderNumber
    );

    if (exists) {
        throw new OrderNumberAlreadyExistsError();
    }
}

export function assertUniqueInvoiceNumber(
    orders: Order[],
    invoiceNumber: string
): void {
    const exists = orders.some(
        (order) => order.invoiceNumber === invoiceNumber
    );

    if (exists) {
        throw new InvoiceNumberAlreadyExistsError();
    }
}