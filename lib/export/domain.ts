import { listTenantOrders } from "@/lib/orders/domain";
import { listPaymentsByTenant } from "@/lib/payments/storage";
import { runTenantReconciliation } from "@/lib/reconciliation/domain";

import type { ExportRequest } from "@/types/export";

export type OrderExportRow = {
    orderId: string;
    status: string;
    total: number;
    currency: string;
    paymentStatus: string;
    paymentAmount: number;
    createdAt: string;
};

export type ReconciliationExportRow = {
    type: string;
    orderId: string;
    paymentId: string;
    productId: string;
    expected: string;
    actual: string;
    detectedAt: string;
};

export type ExportDomainResult = {
    filename: string;
    rows: OrderExportRow[] | ReconciliationExportRow[];
};

export function generateExport(
    tenantId: string,
    request: ExportRequest
): ExportDomainResult {

    switch (request.type) {

        case "ORDERS": {
            const orders = listTenantOrders(tenantId);
            const payments = listPaymentsByTenant(tenantId);

            const paymentMap = new Map(
                payments.map(p => [p.orderId, p])
            );

            const rows = orders.map(order => {
                const payment = paymentMap.get(order.orderId);

                return {
                    orderId: order.orderId,
                    status: order.status,
                    total: order.total,
                    currency: order.currency,
                    paymentStatus: payment?.status ?? "NONE",
                    paymentAmount: payment?.amount ?? 0,
                    createdAt: order.createdAt,
                };
            });

            return {
                filename: `orders-${tenantId.replace(/[^a-zA-Z0-9-_]/g, "")}.csv`,
                rows,
            };
        }

        case "RECONCILIATION": {
            const report = runTenantReconciliation(tenantId);

            const rows = report.mismatches.map(m => ({
                type: m.type,
                orderId: m.orderId ?? "",
                paymentId: m.paymentId ?? "",
                productId: m.productId ?? "",
                expected: JSON.stringify(m.expected),
                actual: JSON.stringify(m.actual),
                detectedAt: m.detectedAt,
            }));

            return {
                filename: `reconciliation-${tenantId}.csv`,
                rows,
            };
        }

        default: {
            const _exhaustive: never = request.type;
            throw new Error(`Unknown export type: ${_exhaustive}`);
        }
    }
}