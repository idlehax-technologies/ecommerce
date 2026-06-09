import { listTenantOrders } from "@/lib/orders/domain";
import { listTenantPayments } from "@/lib/payments/domain";
import { runTenantReconciliation } from "@/lib/reconciliation/domain";

import type { ExportRequest } from "@/types/export";
import { ExportGenerationError } from "./errors";

type OrderExportRow = {
    orderId: string;
    status: string;
    total: number;
    currency: string;
    paymentStatus: string;
    paymentAmount: number;
    createdAt: string;
};

type ReconciliationExportRow = {
    type: string;
    orderId: string;
    paymentId: string;
    productId: string;
    expected: string;
    actual: string;
    detectedAt: string;
};

type ExportDomainResult = {
    filename: string;
    rows: OrderExportRow[] | ReconciliationExportRow[];
};

function sanitizeFilename(value: string): string {
    return value.replace(/[^a-zA-Z0-9-_]/g, "");
}

export async function generateExport(
    tenantId: string,
    request: ExportRequest
): Promise<ExportDomainResult> {

    const safeTenantId = sanitizeFilename(tenantId);

    switch (request.type) {

        case "ORDERS": {
            const orders = await listTenantOrders(tenantId);
            const payments = listTenantPayments(tenantId);

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
                filename: `orders-${safeTenantId}.csv`,
                rows,
            };
        }

        case "RECONCILIATION": {
            const report = await runTenantReconciliation(tenantId);

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
                filename: `reconciliation-${safeTenantId}.csv`,
                rows,
            };
        }

        default: {
            const _exhaustive: never = request.type;
            throw new ExportGenerationError(`Unknown export type: ${_exhaustive}`);
        }
    }
}