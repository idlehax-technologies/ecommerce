import { listTenantOrders } from "@/lib/orders/domain";
import { listTenantPayments } from "@/lib/payments/domain";
import { runTenantReconciliation } from "@/lib/reconciliation/domain";
import { listTenantProducts } from "@/lib/tenantInventory/service";

import { formatUnknownValue } from "@/lib/format/unknown";
import { formatDateTime } from "@/lib/format/datetime";
import { ExportGenerationError } from "./errors";

import type { ExportRequest } from "@/types/export";

type OrderExportRow = {
    orderNumber: string;

    customerName: string;
    customerPhone: string;

    status: string;

    paymentStatus: string;
    paymentMethod: string;

    total: number;

    invoiceNumber: string;
    sellerGstin: string;

    createdAt: string;
};

type ReconciliationExportRow = {
    type: string;

    orderNumber: string;
    invoiceNumber: string;

    sku: string;

    expected: string;
    actual: string;

    detectedAt: string;
};

type ExportDomainResult = {
    filename: string;
    headers: readonly string[];
    rows: OrderExportRow[] | ReconciliationExportRow[];
};

function exportDate(): string {
    return new Date()
        .toISOString()
        .slice(0, 10);
}

export async function generateExport(
    tenantId: string,
    request: ExportRequest
): Promise<ExportDomainResult> {

    switch (request.type) {

        case "ORDERS": {
            const orders = await listTenantOrders(tenantId);
            const payments = await listTenantPayments(tenantId);

            const paymentMap = new Map(
                payments.map(payment => [payment.orderId, payment])
            );

            const rows = [...orders]
                .sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                )
                .map(order => {
                    const payment = paymentMap.get(order.orderId);

                    return {
                        orderNumber: order.orderNumber,

                        customerName: order.customer.fullName,
                        customerPhone: order.customer.phone,

                        status: order.status,

                        paymentStatus:
                            payment?.status ??
                            "Awaiting Payment",

                        paymentMethod:
                            payment?.method ??
                            "Awaiting Payment",

                        total: order.total,

                        invoiceNumber:
                            order.invoiceNumber ??
                            "Not Issued",

                        sellerGstin:
                            order.seller.gstin ??
                            "Not Registered",

                        createdAt:
                            formatDateTime(order.createdAt),
                    };
                });

            return {
                filename: `orders-${exportDate()}.csv`,
                headers: [
                    "Order Number",

                    "Customer Name",
                    "Customer Phone",

                    "Status",

                    "Payment Status",
                    "Payment Method",

                    "Total",

                    "Invoice Number",
                    "Seller GSTIN",

                    "Created At",
                ],
                rows,
            };
        }

        case "RECONCILIATION": {
            const report = await runTenantReconciliation(tenantId);
            const orders = await listTenantOrders(tenantId);
            const products = await listTenantProducts(tenantId);

            const orderMap = new Map(
                orders.map(order => [order.orderId, order])
            );

            const productMap = new Map(
                products.map(product => [product.productId, product])
            );

            const rows = [...report.mismatches]
                .sort(
                    (a, b) =>
                        new Date(b.detectedAt).getTime() -
                        new Date(a.detectedAt).getTime()
                )
                .map(mismatch => {

                    const order =
                        mismatch.orderId
                            ? orderMap.get(mismatch.orderId)
                            : undefined;

                    const product =
                        mismatch.productId
                            ? productMap.get(mismatch.productId)
                            : undefined;

                    return {
                        type: mismatch.type,

                        orderNumber:
                            order?.orderNumber ??
                            "N/A",

                        invoiceNumber:
                            order?.invoiceNumber ??
                            "N/A",

                        sku:
                            product?.sku ??
                            "N/A",

                        expected:
                            formatUnknownValue(mismatch.expected),

                        actual:
                            formatUnknownValue(mismatch.actual),

                        detectedAt:
                            formatDateTime(mismatch.detectedAt),
                    };
                });

            return {
                filename: `reconciliation-${exportDate()}.csv`,
                headers: [
                    "Type",

                    "Order Number",
                    "Invoice Number",

                    "SKU",

                    "Expected",
                    "Actual",

                    "Detected At",
                ],
                rows,
            };
        }

        default: {
            const _exhaustive: never = request.type;
            throw new ExportGenerationError(`Unknown export type: ${_exhaustive}`);
        }
    }
}