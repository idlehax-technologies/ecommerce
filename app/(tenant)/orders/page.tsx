"use client";

import { useEffect, useState } from "react";

import {
    Container,
    Typography,
    Box,
    CircularProgress,
} from "@mui/material";

import { getOrders } from "@/lib/api/orders";

import OrdersList from "@/components/orders/OrdersList";

import type { OrderListItem } from "@/types/order";

import { toOrderListItem } from "@/lib/mappers/orderView";

export default function FulfillmentPage() {

    const [orders, setOrders] = useState<OrderListItem[]>([]);

    const [loading, setLoading] = useState(true);

    async function load() {
        try {
            setLoading(true);
            const res = await getOrders();
            setOrders(res.orders.map(toOrderListItem));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container sx={{ mt: 6 }}>
            <Typography
                variant="h4"
                gutterBottom
            >
                Orders
            </Typography>
            <Box mt={3}>
                <OrdersList orders={orders} />
            </Box>
        </Container>
    );
}