"use client";

import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
    Chip,
    Stack,
} from "@mui/material";

import { orders } from "@/lib/orders";
import type { OrderStatus } from "@/types/order";

function getStatusColor(status: OrderStatus) {
    switch (status) {
        case "PICKED_UP":
            return "success";

        case "PAID":
            return "info";

        case "RESERVED":
            return "warning";

        case "CANCELLED":
        case "EXPIRED":
            return "error";

        default:
            return "default";
    }
}

export default function OrdersPage() {
    return (
        <Box p={3} maxWidth={800} mx="auto">
            <Typography variant="h4" gutterBottom>
                My Orders
            </Typography>

            {orders.length === 0 && (
                <Typography color="text.secondary">
                    No Orders Yet.
                </Typography>
            )}

            {orders.map((order) => (
                <Card key={order.orderId} sx={{ mb: 2 }}>
                    <CardContent>
                        <Stack spacing={1}>
                            <Typography fontWeight={600}>
                                Order: {order.orderId}
                            </Typography>

                            <Divider />

                            <Typography variant="body2" color="text.secondary">
                                Date: {new Date(order.createdAt).toLocaleString()}
                            </Typography>

                            <Typography>
                                ₹ {(order.total / 100).toFixed(2)}
                            </Typography>

                            <Chip
                                label={order.status}
                                color={getStatusColor(order.status)}
                                size="small"
                                sx={{ width: "fit-content" }}
                            />
                        </Stack>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}
