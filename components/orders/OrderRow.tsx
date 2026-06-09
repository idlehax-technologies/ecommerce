"use client";

import Link from "next/link";

import {
    Paper,
    Stack,
    Typography,
    Chip,
    Divider,
    Button,
    Box,
} from "@mui/material";

import type {
    OrderStatus,
    OrderListItem,
} from "@/types/order";

import { getInvoiceUrl } from "@/lib/api/orders";

function getStatusColor(
    status: OrderStatus
) {

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

export default function OrderRow({
    order,
}: {
    order: OrderListItem;
}) {
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

            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
            >

                <Typography>
                    Order: {order.orderNumber}
                </Typography>

                <Divider
                    orientation="vertical"
                    flexItem
                />

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Placed: {new Date(order.createdAt)
                        .toLocaleString()}
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <Typography fontWeight={500}>
                    ₹{(order.total / 100).toFixed(2)}
                </Typography>

                <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                    sx={{
                        width: "fit-content",
                    }}
                />
            </Stack>

        </Paper>
    );
}