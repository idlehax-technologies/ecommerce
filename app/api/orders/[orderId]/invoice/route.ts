import { guardRequest } from "@/lib/security/requestGuard";
import {
    requireMembershipRole,
    requireMembership,
} from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

import { getTenantOrder } from "@/lib/orders/domain";
import { assertOrderVisible } from "@/lib/orders/guards";
import { getStateCode } from "@/lib/tenants/states";

import {
    getGstInvoiceLine,
    getGstInvoiceTotals,
} from "@/lib/calculations/invoice";
import {
    getDiscountAmount,
    getDiscountedPrice,
} from "@/lib/calculations/pricing";
import { formatINR } from "@/lib/format/currency";
import { formatDateTime } from "@/lib/format/datetime";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;

        const user = await guardRequest(req, { requireAuth: true });

        await requireMembershipRole(user, ["customer", "staff"]);
        const actor = await requireMembership(user);

        const order = await getTenantOrder(actor.tenantId, orderId);
        assertOrderVisible(actor, order);

        if (!order.invoiceNumber || !order.invoiceIssuedAt) {
            return new Response("Invoice not available", {
                status: 404,
            });
        }

        const isGstTenant = !!order.seller.gstin;

        const gstInvoiceTotals = getGstInvoiceTotals(order.items);

        const roundingAdjustment =
            order.total - gstInvoiceTotals.total;

        const roundedOffDisplay =
            roundingAdjustment >= 0
                ? `+${formatINR(roundingAdjustment)}`
                : `-${formatINR(Math.abs(roundingAdjustment))}`;

        const rows = order.items
            .map((item) => {
                const gstInvoiceLine = getGstInvoiceLine(item);

                const gstDiscountDisplay =
                    `${formatINR(
                        gstInvoiceLine.discountValue
                    )} (${item.discountPercent}%)`;

                const grossValue =
                    item.price * item.quantity;

                const discountValue =
                    getDiscountAmount(
                        item.price,
                        item.discountPercent
                    ) * item.quantity;

                const discountedAmount =
                    getDiscountedPrice(
                        item.price,
                        item.discountPercent
                    ) * item.quantity;

                const discountDisplay =
                    `${formatINR(discountValue)} (${item.discountPercent}%)`;

                if (!isGstTenant) {
                    return `
<tr>
    <td>${item.description}</td>
    <td>${item.hsnCode}</td>
    <td>${item.quantity}</td>

    <td>${formatINR(item.price)}</td>
    <td>${formatINR(grossValue)}</td>

    <td>${discountDisplay}</td>

    <td>${formatINR(discountedAmount)}</td>
</tr>
`;
                }

                return `
<tr>
    <td>${item.description}</td>
    <td>${item.hsnCode}</td>
    <td>${item.quantity}</td>

    <td>${formatINR(gstInvoiceLine.unitPriceExGst)}</td>
    <td>${formatINR(gstInvoiceLine.grossValue)}</td>

    <td>${gstDiscountDisplay}</td>

    <td>${formatINR(gstInvoiceLine.taxableValue)}</td>

    <td>${formatINR(gstInvoiceLine.cgst)} (${item.gstRate / 2}%)</td>
    <td>${formatINR(gstInvoiceLine.sgst)} (${item.gstRate / 2}%)</td>

    <td>${formatINR(gstInvoiceLine.amount)}</td>
</tr>
`;
            }).join("");

        const table =
            isGstTenant
                ? `
<table>
    <thead>
        <tr>
            <th>Description</th>
            <th>HSN</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Gross Value</th>
            <th>Discount</th>
            <th>Taxable Value</th>
            <th>CGST</th>
            <th>SGST</th>
            <th>Amount</th>
        </tr>
    </thead>

    <tbody>
        ${rows}
    </tbody>
</table>

<div class="summary">
    <div class="row">
        <span>Subtotal</span>
        <strong>${formatINR(gstInvoiceTotals.subtotal)}</strong>
    </div>

    <div class="row">
        <span>CGST</span>
        <strong>${formatINR(gstInvoiceTotals.cgst)}</strong>
    </div>

    <div class="row">
        <span>SGST</span>
        <strong>${formatINR(gstInvoiceTotals.sgst)}</strong>
    </div>

    <div class="row">
        <span>Total</span>
        <strong>${formatINR(gstInvoiceTotals.total)}</strong>
    </div>

    <div class="row">
        <span>Rounded Off</span>
        <strong>${roundedOffDisplay}</strong>
    </div>

    <div class="row total">
        <span>Final Amount</span>
        <strong>${formatINR(order.total)}</strong>
    </div>
</div>
`
                : `
<table>
    <thead>
        <tr>
            <th>Description</th>
            <th>HSN</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Gross Value</th>
            <th>Discount</th>
            <th>Amount</th>
        </tr>
    </thead>

    <tbody>
        ${rows}
    </tbody>
</table>

<div class="summary">
    <div class="row total">
        <span>Final Amount</span>
        <strong>${formatINR(order.total)}</strong>
    </div>
</div>
`;

        const html = `
<html>

<head>

<title>${order.invoiceNumber}</title>

<style>

body {
    font-family: Arial, sans-serif;
    padding: 24px;
    color: #111;
}

h1 {
    text-align: center;
    margin: 0 0 24px;
}

h3 {
    margin: 24px 0 8px;
}

.section {
    margin-bottom: 24px;
}

.row {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 8px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 24px;
}

th,
td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
    vertical-align: top;
}

th {
    background: #f5f5f5;
}

.summary {
    margin-top: 24px;
    margin-left: auto;
    width: 420px;
}

.total {
    font-size: 18px;
    font-weight: 700;
}

.actions {
    display: flex;
    justify-content: center;
    margin-top: 24px;
}

.invoice-type {
    text-align: center;
    margin-bottom: 24px;
}

.meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

@media print {

    .actions {
        display: none;
    }

    body {
        padding: 0;
    }
}
</style>

</head>

<body>

<h1>
    ${isGstTenant
                ? "TAX INVOICE"
                : "INVOICE"
            }
</h1>

<div class="section">
    <div class="row">
        <span>Invoice Number</span>
        <strong>${order.invoiceNumber}</strong>
    </div>

    <div class="row">
        <span>Invoice Issued</span>
        <strong>
            ${formatDateTime(order.invoiceIssuedAt)}
        </strong>
    </div>

    <div class="row">
        <span>Order Number</span>
        <strong>${order.orderNumber}</strong>
    </div>

    <div class="row">
        <span>Order Placed</span>
        <strong>
            ${formatDateTime(order.createdAt)}
        </strong>
    </div>
</div>

<div class="section">
    <h3>Sold By</h3>
    <div>${order.seller.name}</div>
    <div>${order.seller.address}</div>

    <div>
        ${order.seller.state}
        (${getStateCode(order.seller.state)})
    </div>

    ${isGstTenant
                ? `
    <div>
        GSTIN:
        ${order.seller.gstin}
    </div>
    `
                : ""
            }
</div>

<div class="section">
    <h3>Sold To</h3>
    <div>${order.customer.fullName}</div>

    ${order.customer.phone.trim()
                ? `
    <div>
        Phone:
        ${order.customer.phone}
    </div>
    `
                : ""
            }
</div>

${table}

<div class="summary">
    <div class="row">
        <span>Payment Method</span>
        <strong>
            ${order.paymentMethod ?? "N/A"}
        </strong>
    </div>

    <div class="row">
        <span>Currency</span>
        <strong>INR (₹)</strong>
    </div>
</div>

<div class="actions">
    <button onclick="window.print()">
        Print Invoice
    </button>
</div>

</body>

</html>
`;

        return new Response(
            html,
            {
                headers: {
                    "Content-Type":
                        "text/html; charset=utf-8",

                    "Content-Disposition":
                        `inline; filename=${order.invoiceNumber}.html`,
                },
            }
        );

    } catch (err: unknown) {
        return handleRouteError(err);
    }
}