"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Container, CircularProgress } from "@mui/material";

import { getOrder } from "@/lib/api/orders";
import { fetchTenant } from "@/lib/api/tenants";

import OrderDetail from "@/components/orders/OrderDetail";

import { useActiveMembership } from "@/hooks/useActiveMembership";

import type { Order } from "@/types/order";
import type { Tenant } from "@/types/tenant";

export default function OrderDetailPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const { membership, loading: mLoading } = useActiveMembership();

    const [order, setOrder] = useState<Order | null>(null);
    const [tenant, setTenant] = useState<Tenant | null>(null);

    const [loading, setLoading] = useState(true);

    async function load() {
        if (!membership) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const orderRes = await getOrder(orderId);
            setOrder(orderRes.order);

            const tenantRes = await fetchTenant(membership.tenantId);
            setTenant(tenantRes.tenant);

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [orderId, membership]);

    if (
        loading ||
        mLoading
    ) {
        return <CircularProgress />;
    }

    if (
        !order ||
        !membership ||
        !tenant
    ) {
        return null;
    }

    return (
        <Container sx={{ mt: 6 }}>
            <OrderDetail
                order={order}
                reload={load}
                actorRole={membership.role}
                hasGst={!!tenant.gstin}
            />
        </Container>
    );
}