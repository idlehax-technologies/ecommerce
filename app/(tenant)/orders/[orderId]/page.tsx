// app/(tenant)/orders/[orderId]/page.tsx

import { Container } from "@mui/material";
import { notFound } from "next/navigation";

import { getUserFromRequest } from "@/lib/auth";
import { requireTenant } from "@/lib/auth/guards";
import { getTenantOrder } from "@/lib/orders/domain";

import OrderDetail from "@/components/orders/OrderDetail";

type PageProps = {
    params: Promise<{ orderId: string }>;
};

export default async function OrderDetailPage({ params }: PageProps) {
    const { orderId } = await params;
    const actor = requireTenant(await getUserFromRequest());

    let order;
    try {
        order = getTenantOrder(actor.tenantId, orderId);
    } catch {
        notFound();
    }

    return (
        <Container sx={{ mt: 6 }}>
            <OrderDetail order={order} />
        </Container>
    );
}