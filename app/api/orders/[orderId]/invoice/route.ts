import { guardRequest } from "@/lib/security/requestGuard";
import { requireTenant } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

import { getTenantOrder } from "@/lib/orders/domain";
import { assertOrderVisible } from "@/lib/orders/guards";

import { getStateCode } from "@/lib/tenants/states";

function formatMoney(paise: number): string {
    return (paise / 100).toFixed(2);
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;

        const user = await guardRequest(req, { requireAuth: true });
        const actor = requireTenant(user);

        const order = getTenantOrder(actor.tenantId, orderId);

        assertOrderVisible(actor, order);

        if (!order.invoiceNumber || !order.invoiceIssuedAt) {
            return new Response("Invoice not available", {
                status: 404,
            });
        }

        const isGstTenant = !!order.seller.gstin;

        let subtotal = 0;
        let totalCgst = 0;
        let totalSgst = 0;

        const rows = order.items
            .map((item, index) => {
                const amount = item.price * item.quantity;

                if (!isGstTenant) {
                    return `
<tr>
    <td>${index + 1}</td>
    <td>${item.description}</td>
    <td>${item.hsnCode}</td>
    <td>${item.quantity}</td>
    <td>₹${formatMoney(item.price)}</td>
    <td>₹${formatMoney(amount)}</td>
</tr>
`;
                }

                const unitPrice =
                    Math.round(
                        item.price * 100 /
                        (100 + item.gstRate)
                    );

                const taxableValue = unitPrice * item.quantity;

                const tax = amount - taxableValue;

                const cgst = Math.ceil(tax / 2);

                const sgst = tax - cgst;

                subtotal += taxableValue;
                totalCgst += cgst;
                totalSgst += sgst;

                return `
<tr>
    <td>${index + 1}</td>
    <td>${item.description}</td>
    <td>${item.hsnCode}</td>
    <td>${item.quantity}</td>
    <td>₹${formatMoney(unitPrice)}</td>
    <td>₹${formatMoney(taxableValue)}</td>
    <td>₹${formatMoney(cgst)}</td>
    <td>₹${formatMoney(sgst)}</td>
    <td>₹${formatMoney(amount)}</td>
</tr>
`;
            })
            .join("");

        const table = isGstTenant
            ? `
<table>
    <thead>
        <tr>
            <th>Sl. No.</th>
            <th>Description</th>
            <th>HSN</th>
            <th>Qty</th>
            <th>Unit Price</th>
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
        <strong>Subtotal</strong>
        <strong>₹${formatMoney(subtotal)}</strong>
    </div>

<div class="row">
    <strong>CGST</strong>
    <strong>₹${formatMoney(totalCgst)}</strong>
</div>

<div class="row">
    <strong>SGST</strong>
    <strong>₹${formatMoney(totalSgst)}</strong>
</div>

<div class="row total">
    <strong>Total</strong>
    <strong>₹${formatMoney(order.total)}</strong>
</div>
</div>
`
            : `
<table>
    <thead>
        <tr>
            <th>Sl. No.</th>
            <th>Description</th>
            <th>HSN</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Amount</th>
        </tr>
    </thead>

<tbody>
    ${rows}
</tbody>
</table>

<div class="summary">
    <div class="row total">
        <strong>Total</strong>
        <strong>₹${formatMoney(order.total)}</strong>
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
    }

    th {
        background: #f5f5f5;
    }

    .summary {
        margin-top: 24px;
    }

    .total {
        font-size: 18px;
    }

    .actions {
        display: flex;
        justify-content: center;
    }

    @media print {
        .actions {
            display: none;
        }
    }
</style>
</head>

<body>
<h1>
    ${isGstTenant
                ? "TAX INVOICE"
                : "INVOICE"}
</h1>

<div class="section">
    <div class="row">
        <span>Invoice Number</span>
        <strong>${order.invoiceNumber}</strong>
    </div>

    <div class="row">
        <span>Invoice Issued</span>
        <strong>
            ${new Date(order.invoiceIssuedAt).toLocaleString()}
        </strong>
    </div>

    <div class="row">
        <span>Order Number</span>
        <strong>${order.orderNumber}</strong>
    </div>

    <div class="row">
        <span>Order Placed</span>
        <strong>
            ${new Date(order.createdAt).toLocaleString()}
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
    GSTIN: ${order.seller.gstin}
</div>
`
                : ""}
</div>

<div class="section">
    <h3>Sold To</h3>

    <div>${order.customer.fullName}</div>

    <div>${order.customer.addressText}</div>
</div>

${table}

<div class="section">
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