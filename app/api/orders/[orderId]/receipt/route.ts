import { guardRequest } from "@/lib/security/requestGuard";
import { requireTenant } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

import { getTenantOrder } from "@/lib/orders/domain";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;

        const user = await guardRequest(req, { requireAuth: true });
        const actor = requireTenant(user);

        const order = getTenantOrder(actor.tenantId, orderId);

        if (order.userId !== user.userId) {
            return new Response("Not found", { status: 404 });
        }

        // 🔴 Simple PDF (HTML → printable)
        const html = `
        <html>
        <head>
            <style>
                body { font-family: Arial; padding: 24px; }
                .row { display:flex; justify-content:space-between; }
                .divider { margin:16px 0; border-top:1px solid #ccc; }
            </style>
        </head>
        <body>
            <h2>Receipt</h2>
            <p>Order ID: ${order.orderId}</p>
            <p>Date: ${new Date(order.createdAt).toLocaleString()}</p>

            <div class="divider"></div>

            ${order.items
                .map(
                    (item) => `
                <div class="row">
                    <div>
                        <div>${item.name}</div>
                        <div>${item.quantity} × ₹ ${(item.price / 100).toFixed(2)}</div>
                    </div>
                    <div>₹ ${((item.price * item.quantity) / 100).toFixed(2)}</div>
                </div>
            `
                )
                .join("")}

            <div class="divider"></div>

            <div class="row">
                <strong>Total</strong>
                <strong>₹ ${(order.total / 100).toFixed(2)}</strong>
            </div>

            <div class="row">
                <span>Payment</span>
                <span>${order.paymentMethod}</span>
            </div>
        </body>
        </html>
        `;

        return new Response(html, {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Content-Disposition": `inline; filename=receipt-${orderId}.html`,
            },
        });
    } catch (err) {
        return handleRouteError(err);
    }
}