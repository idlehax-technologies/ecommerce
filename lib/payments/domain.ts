import { randomUUID } from "crypto";
import type { Payment } from "@/types/payment";
import type { Order } from "@/types/order";
import type { DomainEvent } from "@/types/domainEvent";

import {
    savePayment,
    getPaymentByOrder,
    updatePayment,
    listPaymentsByTenant,
} from "./storage";

import {
    PaymentAlreadyExistsError,
    PaymentInvalidAmountError,
    PaymentNotFoundError,
} from "./errors";

import {
    InvalidOrderTransitionError,
} from "@/lib/orders/errors";

import * as ordersDomain from "@/lib/orders/domain";

export function listTenantPayments(
    tenantId: string
): Payment[] {
    return listPaymentsByTenant(tenantId);
}

/**
 * RECORD PAYMENT (PENDING)
 *
 * - creates payment record
 * - does NOT emit event (no state change in order)
 */
export function recordPayment(
    tenantId: string,
    orderId: string,
    method: Payment["method"]
): {
    payment: Payment;
    order: Order;
} {

    const order = ordersDomain.getTenantOrder(
        tenantId,
        orderId
    );

    if (order.status !== "RESERVED") {
        throw new InvalidOrderTransitionError(
            order.status,
            "PAID"
        );
    }

    const existing = getPaymentByOrder(orderId);

    if (existing) {
        throw new PaymentAlreadyExistsError();
    }

    if (order.total <= 0) {
        throw new PaymentInvalidAmountError();
    }

    const payment: Payment = {
        paymentId: randomUUID(),
        orderId,
        tenantId,
        method,
        amount: order.total,
        currency: order.currency,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    savePayment(payment);

    return {
        payment,
        order,
    };
}

/**
 * CONFIRM PAYMENT
 *
 * Responsibilities:
 * - mark payment as CONFIRMED
 * - transition order → PAID (via order domain)
 * - emit DomainEvent (PaymentConfirmed)
 *
 * MUST:
 * - always return event (no undefined)
 * - never emit OrderPaid manually
 */
export async function confirmPayment(
    tenantId: string,
    orderId: string
): Promise<{
    payment: Payment;
    order: Order;
    events: DomainEvent[];
}> {

    const payment =
        getPaymentByOrder(orderId);

    if (!payment) {
        throw new PaymentNotFoundError();
    }

    if (payment.tenantId !== tenantId) {
        throw new PaymentNotFoundError();
    }

    // idempotent case
    if (payment.status === "CONFIRMED") {

        const order =
            ordersDomain.getTenantOrder(
                tenantId,
                orderId
            );

        const paymentConfirmedEvent: DomainEvent = {
            type: "PaymentConfirmed",
            order,
            payment,
        };

        return {
            payment,
            order,
            events: [paymentConfirmedEvent],
        };
    }

    payment.status = "CONFIRMED";
    payment.updatedAt =
        new Date().toISOString();

    updatePayment(payment);

    const orderResult =
        await ordersDomain.markOrderPaid(
            tenantId,
            orderId,
            payment.method
        );

    const order = orderResult.order;

    const paymentConfirmedEvent: DomainEvent = {
        type: "PaymentConfirmed",
        order,
        payment,
    };

    const orderPaidEvent =
        orderResult.event;

    return {
        payment,
        order,
        events: [
            paymentConfirmedEvent,
            orderPaidEvent,
        ],
    };
}