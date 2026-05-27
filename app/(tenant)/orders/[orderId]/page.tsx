"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Container, CircularProgress } from "@mui/material";

import { getOrder } from "@/lib/api/orders";

import OrderDetail from "@/components/orders/OrderDetail";

import type { Order } from "@/types/order";

import { useActiveMembership } from "@/hooks/useActiveMembership";

export default function OrderDetailPage() {

    const { orderId } = useParams<{ orderId: string }>();

    const { membership, loading: membershipLoading } = useActiveMembership();

    const [order, setOrder] = useState<Order | null>(null);

    const [loading, setLoading] = useState(true);

    async function load() {
        try {
            setLoading(true);
            const res = await getOrder(orderId);
            setOrder(res.order);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [orderId]);

    if (
        loading ||
        membershipLoading
    ) {
        return <CircularProgress />;
    }

    if (
        !order ||
        !membership
    ) {
        return null;
    }

    return (
        <Container sx={{ mt: 6 }}>
            <OrderDetail
                order={order}
                reload={load}
                actorRole={membership.role}
            />
        </Container>
    );
}