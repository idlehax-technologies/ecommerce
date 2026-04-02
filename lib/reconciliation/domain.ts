import { listTenantOrders } from "@/lib/orders/domain";
import { listPaymentsByTenant } from "@/lib/payments/storage";
import { listTenantInventory } from "@/lib/tenantInventory/domain";

import type { ReconciliationMismatch, ReconciliationReport } from "@/types/reconciliation";

export function runTenantReconciliation(
    tenantId: string
): ReconciliationReport {

    const scannedAt = new Date().toISOString();

    const orders = listTenantOrders(tenantId);
    const payments = listPaymentsByTenant(tenantId);
    const inventory = listTenantInventory(tenantId);

    const mismatches: ReconciliationMismatch[] = [];

    const paymentByOrder = new Map(
        payments.map(p => [p.orderId, p])
    );

    /**
     * ORDER ↔ PAYMENT
     */
    for (const order of orders) {

        const payment = paymentByOrder.get(order.orderId);

        // 1. Paid order must have payment
        if (order.status === "PAID" && !payment) {
            mismatches.push({
                type: "ORDER_PAYMENT_MISSING",
                tenantId,
                orderId: order.orderId,
                expected: "payment exists",
                actual: null,
                detectedAt: scannedAt,
            });
        }

        if (payment) {

            // 2. Amount mismatch
            if (payment.amount !== order.total) {
                mismatches.push({
                    type: "ORDER_PAYMENT_AMOUNT_MISMATCH",
                    tenantId,
                    orderId: order.orderId,
                    paymentId: payment.paymentId,
                    expected: order.total,
                    actual: payment.amount,
                    detectedAt: scannedAt,
                });
            }

            // 3. Paid order must have confirmed payment
            if (order.status === "PAID" && payment.status !== "CONFIRMED") {
                mismatches.push({
                    type: "ORDER_PAID_BUT_PAYMENT_NOT_CONFIRMED",
                    tenantId,
                    orderId: order.orderId,
                    paymentId: payment.paymentId,
                    expected: "CONFIRMED",
                    actual: payment.status,
                    detectedAt: scannedAt,
                });
            }
        }
    }

    /**
     * PAYMENT WITHOUT ORDER
     */
    const orderIds = new Set(orders.map(o => o.orderId));

    for (const payment of payments) {
        if (!orderIds.has(payment.orderId)) {
            mismatches.push({
                type: "PAYMENT_WITHOUT_ORDER",
                tenantId,
                paymentId: payment.paymentId,
                expected: "order exists",
                actual: null,
                detectedAt: scannedAt,
            });
        }
    }

    /**
     * INVENTORY VALIDATION
     */
    const expectedReserved = new Map<string, number>();

    for (const order of orders) {
        if (order.status === "RESERVED") {
            for (const item of order.items) {
                expectedReserved.set(
                    item.productId,
                    (expectedReserved.get(item.productId) ?? 0) + item.quantity
                );
            }
        }
    }

    for (const record of inventory) {

        // 4. Negative reserved
        if (record.reserved < 0) {
            mismatches.push({
                type: "INVENTORY_NEGATIVE_RESERVED",
                tenantId,
                productId: record.productId,
                expected: ">= 0",
                actual: record.reserved,
                detectedAt: scannedAt,
            });
        }

        // 5. Reserved > stock
        if (record.reserved > record.stock) {
            mismatches.push({
                type: "INVENTORY_RESERVED_EXCEEDS_STOCK",
                tenantId,
                productId: record.productId,
                expected: `<= ${record.stock}`,
                actual: record.reserved,
                detectedAt: scannedAt,
            });
        }

        // 6. Reservation mismatch vs orders
        const expected = expectedReserved.get(record.productId) ?? 0;

        if (record.reserved !== expected) {
            mismatches.push({
                type: "INVENTORY_RESERVATION_MISMATCH",
                tenantId,
                productId: record.productId,
                expected,
                actual: record.reserved,
                detectedAt: scannedAt,
            });
        }
    }

    return {
        tenantId,
        scannedAt,
        mismatches,
    };
}