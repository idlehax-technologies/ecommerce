import type { Payment } from "@/types/payment";

type GlobalPayments = typeof globalThis & {
    __paymentsById?: Map<string, Payment>;
    __paymentsByOrder?: Map<string, Payment>;
};

const globalForPayments = globalThis as GlobalPayments;

const paymentsById =
    globalForPayments.__paymentsById ?? new Map<string, Payment>();

const paymentsByOrder =
    globalForPayments.__paymentsByOrder ?? new Map<string, Payment>();

globalForPayments.__paymentsById = paymentsById;
globalForPayments.__paymentsByOrder = paymentsByOrder;

export function listPaymentsByTenant(tenantId: string): Payment[] {
    return Array.from(paymentsById.values())
        .filter(p => p.tenantId === tenantId)
        .map(p => ({ ...p }));
}

export function getPaymentByOrder(orderId: string): Payment | null {
    return paymentsByOrder.get(orderId) ?? null;
}

export function savePayment(payment: Payment): void {
    const snapshot = { ...payment };

    paymentsById.set(snapshot.paymentId, snapshot);
    paymentsByOrder.set(snapshot.orderId, snapshot);
}

export function updatePayment(payment: Payment) {
    const snapshot = { ...payment };

    paymentsById.set(snapshot.paymentId, snapshot);
    paymentsByOrder.set(snapshot.orderId, snapshot);
}