// components/orders/OrderRow.tsx

"use client";

import Link from "next/link";
import {
    Paper,
    Stack,
    Typography,
    Chip,
    Divider,
} from "@mui/material";

import type { OrderStatus, OrderListItem } from "@/types/order";

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

export default function OrderRow({ order }: { order: OrderListItem }) {
    return (
        <Paper
            component={Link}
            href={`/orders/${order.orderId}`}
            sx={{
                p: 2,
                textDecoration: "none",
                color: "inherit",
                display: "block",
            }}
        >
            <Stack spacing={1}>
                <Typography fontWeight={600}>
                    Order {order.orderId}
                </Typography>

                <Divider />

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
            </Stack>
        </Paper>
    );
}