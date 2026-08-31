"use client";

import { useEffect, useState } from "react";

import {
    Container,
    Box,
    Stack,
    Typography,
    Divider,
    Paper,
    CircularProgress,
} from "@mui/material";

import OrdersDashboard from "@/components/orders/OrdersDashboard";
import { toOrderListItem } from "@/lib/mappers/orderView";
import { getOrders } from "@/lib/api/orders";
import type { OrderListItem } from "@/types/order";

export default function OrdersPage() {

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
        <Container maxWidth="md">
            <Stack
                spacing={2}
                sx={{ p: { xs: 0, sm: 6 } }}
            >
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Orders
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        View and track orders
                    </Typography>
                </Box>

                <Divider />

                <Paper elevation={2} sx={{ p: 2 }}>
                    <OrdersDashboard
                        orders={orders}
                    />
                </Paper>
            </Stack>
        </Container>
    );
}