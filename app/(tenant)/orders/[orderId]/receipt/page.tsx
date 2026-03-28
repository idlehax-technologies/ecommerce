import OrderReceipt from "@/components/orders/OrderReceipt";

import { getUserFromRequest } from "@/lib/auth";
import { requireTenant, requireAuth } from "@/lib/auth/guards";
import { getTenantOrder } from "@/lib/orders/domain";

import { notFound } from "next/navigation";

type PageProps = {
    params: Promise<{ orderId: string }>;
};

export default async function ReceiptPage({ params }: PageProps) {
    const { orderId } = await params;

    const rawUser = await getUserFromRequest();
    const user = requireAuth(rawUser);
    const actor = requireTenant(user);

    let order;

    try {
        order = getTenantOrder(actor.tenantId, orderId);

        // 🔴 Step 8 guard reuse
        if (order.userId !== user.userId) {
            notFound();
        }
    } catch {
        notFound();
    }

    return (
        <html>
            <body
                style={{
                    background: "#f5f5f5",
                    padding: "40px 0",
                }}
            >
                <OrderReceipt order={order} />
            </body>
        </html>
    );
}