import { randomUUID } from "crypto";
import type { Payment } from "@/types/payment";

import { savePayment, getPaymentByOrder, updatePayment } from "./storage";
import {
    PaymentAlreadyExistsError,
    PaymentInvalidAmountError,
} from "./errors";

import * as ordersDomain from "@/lib/orders/domain";

export function recordPayment(
    tenantId: string,
    orderId: string,
    method: Payment["method"]
) {
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
        status: "PENDING", // 🔥 key change
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    savePayment(payment);

    return {
        payment,
        order, // still RESERVED
    };
}

/**
 * 🔥 NEW — confirm payment (async)
 */
import type { OrderEvent } from "@/types/orderEvent";

export function confirmPayment(
    tenantId: string,
    orderId: string
): {
    payment: Payment;
    order?: ReturnType<typeof ordersDomain.getTenantOrder>;
    event?: OrderEvent;
} {
    const payment = getPaymentByOrder(orderId);

    if (!payment) {
        throw new Error("Payment not found");
    }

    if (payment.status !== "PENDING") {
        return {
            payment,
            event: undefined,
        };
    }

    payment.status = "CONFIRMED";
    payment.updatedAt = new Date().toISOString();

    updatePayment(payment);

    const result = ordersDomain.markOrderPaid(
        tenantId,
        orderId,
        payment.method
    );

    // ✅ CORRECT EVENT CREATION (single source)
    const event: OrderEvent = {
        type: "OrderPaid",
        order: result.order,
        payment,
    };

    return {
        payment,
        order: result.order,
        event,
    };
}