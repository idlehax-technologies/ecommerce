"use client";

import {
    Paper,
    Stack,
    Typography,
    Chip,
    Divider,
    Button,
} from "@mui/material";

import type { OrderStatus, OrderListItem } from "@/types/order";

function getStatusColor(status: OrderStatus) {
    switch (status) {
        case "PICKED_UP":
        case "PAID":
            return "success";

        case "RESERVED":
            return "info";

        case "CANCELLED":
            return "error";

        case "EXPIRED":
        case "REFUNDED":
            return "warning";

        default:
            return "default";
    }
}

export default function OrderRow({ order }: { order: OrderListItem }) {
    return (
        <Paper
            component="a"
            href={`/orders/${order.orderId}`}
            sx={{
                p: 2,
                textDecoration: "none",
                color: "inherit",
                display: "block",
            }}
        >
            <Stack direction="row" spacing={1} alignItems="center">
                <Typography fontWeight={600}>
                    Order {order.orderId}
                </Typography>

                <Divider orientation="vertical" flexItem />

                <Typography variant="body2" color="text.secondary">
                    {new Date(order.createdAt).toLocaleString()}
                </Typography>

                <Typography fontWeight={500}>
                    ₹ {(order.total / 100).toFixed(2)}
                </Typography>

                <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                    sx={{ width: "fit-content" }}
                />

                <Button
                    href={`/orders/${order.orderId}/receipt`}
                    size="small"
                >
                    Receipt
                </Button>
            </Stack>
        </Paper>
    );
}