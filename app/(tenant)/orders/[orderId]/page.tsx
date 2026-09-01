"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
    Container,
    Box,
    Stack,
    Typography,
    Divider,
    Paper,
    CircularProgress,
} from "@mui/material";

import { getOrder } from "@/lib/api/orders";
import { getTenant } from "@/lib/api/tenants";

import { formatDateTime } from "@/lib/format/datetime";
import { useActiveMembership } from "@/hooks/useActiveMembership";

import OrderDetail from "@/components/orders/OrderDetail";

import type { Order } from "@/types/order";
import type { Tenant } from "@/types/tenant";

export default function OrderDetailPage() {
    const { orderId } = useParams<{ orderId: string }>();

    const { membership, loading: membershipLoading } = useActiveMembership();

    const [order, setOrder] = useState<Order | null>(null);
    const [tenant, setTenant] = useState<Tenant | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    if (error) {
        throw error;
    }

    async function load() {

        try {
            setLoading(true);
            setError(null);

            const orderRes = await getOrder(orderId);
            setOrder(orderRes.order);

            const tenantRes = await getTenant();
            setTenant(tenantRes.tenant);

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err);
            } else {
                setError(new Error("Failed to load order"));
            }

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps

    if (
        loading ||
        membershipLoading
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
        <Container maxWidth="md">
            <Stack
                spacing={2}
                sx={{ p: { xs: 0, sm: 6 } }}
            >
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Order Details
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Placed: {formatDateTime(order.createdAt)}
                    </Typography>
                </Box>

                <Divider />

                <Paper elevation={2} sx={{ p: 2 }}>
                    <OrderDetail
                        order={order}
                        reload={load}
                        actorRole={membership.role}
                        hasGst={!!tenant.gstin}
                    />
                </Paper>
            </Stack>
        </Container>
    );
}