import { randomUUID } from "crypto";
import type { Payment } from "@/types/payment";
import type { DomainEvent } from "@/types/domainEvent";

import {
    savePayment,
    getPaymentByOrder,
    updatePayment
} from "./storage";

import {
    PaymentAlreadyExistsError,
    PaymentInvalidAmountError
} from "./errors";

import * as ordersDomain from "@/lib/orders/domain";

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
    order: ReturnType<typeof ordersDomain.getTenantOrder>;
} {

    const order = ordersDomain.getTenantOrder(tenantId, orderId);

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
        order
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
export function confirmPayment(
    tenantId: string,
    orderId: string
): {
    payment: Payment;
    order: ReturnType<typeof ordersDomain.getTenantOrder>;
    events: DomainEvent[];
} {

    const payment = getPaymentByOrder(orderId);

    if (!payment) {
        throw new Error("Payment not found");
    }

    // idempotent case
    if (payment.status === "CONFIRMED") {
        const order = ordersDomain.getTenantOrder(tenantId, orderId);

        return {
            payment,
            order,
            events: [
                {
                    type: "PaymentConfirmed",
                    order,
                    payment
                }
            ]
        };
    }

    // STEP 1 — confirm payment
    payment.status = "CONFIRMED";
    payment.updatedAt = new Date().toISOString();

    updatePayment(payment);

    // STEP 2 — transition order (capture event!)
    const orderResult = ordersDomain.markOrderPaid(
        tenantId,
        orderId,
        payment.method,
        payment
    );

    const order = orderResult.order;

    // 🔴 CRITICAL FIX: capture OrderPaid event
    const orderPaidEvent = orderResult.event;

    // STEP 3 — emit BOTH events
    return {
        payment,
        order,
        events: [
            {
                type: "PaymentConfirmed",
                order,
                payment
            },
            orderPaidEvent
        ]
    };
}