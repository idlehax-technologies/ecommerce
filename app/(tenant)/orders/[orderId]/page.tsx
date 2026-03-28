import { Container } from "@mui/material";
import { notFound } from "next/navigation";

import { getUserFromRequest } from "@/lib/auth";
import { requireTenant, requireAuth } from "@/lib/auth/guards";
import { getTenantOrder } from "@/lib/orders/domain";

import OrderDetail from "@/components/orders/OrderDetail";

type PageProps = {
    params: Promise<{ orderId: string }>;
};

export default async function OrderDetailPage({ params }: PageProps) {
    const { orderId } = await params;

    const rawUser = await getUserFromRequest();
    const user = requireAuth(rawUser);
    const actor = requireTenant(user);

    let order;
    try {
        order = getTenantOrder(actor.tenantId, orderId);

        // 🔥 Step 8 critical guard
        if (order.userId !== user.userId) {
            notFound();
        }

    } catch {
        notFound();
    }

    return (
        <Container sx={{ mt: 6 }}>
            <OrderDetail order={order} />
        </Container>
    );
}