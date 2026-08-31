import { randomUUID } from "crypto";
import type { Payment } from "@/types/payment";
import type { Order } from "@/types/order";
import type { DomainEvent } from "@/types/domainEvent";

import { paymentStore } from "./storage";

import {
    PaymentAlreadyExistsError,
    PaymentInvalidAmountError,
    PaymentNotFoundError,
} from "./errors";

import {
    InvalidOrderTransitionError,
} from "@/lib/orders/errors";

import * as ordersDomain from "@/lib/orders/domain";

export async function listTenantPayments(
    tenantId: string
): Promise<Payment[]> {

    return paymentStore.listByTenant(
        tenantId
    );
}

/**
 * RECORD PAYMENT (PENDING)
 *
 * - creates payment record
 * - does NOT emit event (no state change in order)
 */
export async function recordPayment(
    tenantId: string,
    orderId: string,
    method: Payment["method"]
): Promise<{
    payment: Payment;
    order: Order;
}> {

    const order =
        await ordersDomain.getTenantOrder(
            tenantId,
            orderId
        );

    if (order.status !== "RESERVED") {
        throw new InvalidOrderTransitionError(
            order.status,
            "PAID"
        );
    }

    const existing =
        await paymentStore.getByOrder(
            orderId
        );

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
        amount: order.total,
        currency: order.currency,
        method,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    await paymentStore.save(payment);

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
 * - return empty events for idempotent calls
 * - emit PaymentConfirmed only on actual transition
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
        await paymentStore.getByOrder(
            orderId
        );

    if (!payment || payment.tenantId !== tenantId) {
        throw new PaymentNotFoundError();
    }

    // idempotent case
    if (payment.status === "CONFIRMED") {

        const order =
            await ordersDomain.getTenantOrder(
                tenantId,
                orderId
            );

        return {
            payment,
            order,
            events: [],
        };
    }

    const previousStatus = payment.status;

    payment.status = "CONFIRMED";

    payment.updatedAt =
        new Date().toISOString();

    await paymentStore.update(payment);

    const orderResult =
        await ordersDomain.markOrderPaid(
            tenantId,
            orderId,
            payment.method
        );

    const order = orderResult.order;

    const paymentConfirmedEvent: DomainEvent = {
        type: "PaymentConfirmed",
        payment,
        from: previousStatus,
        to: payment.status,
    };

    const orderPaidEvent = orderResult.event;

    return {
        payment,
        order,
        events: [
            paymentConfirmedEvent,
            orderPaidEvent,
        ],
    };
}