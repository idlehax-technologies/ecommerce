"use client";

import Link from "next/link";

import {
    Paper,
    Stack,
    Typography,
    Chip,
} from "@mui/material";

import OrderStatusBadge from "./OrderStatusBadge";
import { formatINR } from "@/lib/format/currency";
import { formatDateTime } from "@/lib/format/datetime";
import type { OrderListItem } from "@/types/order";

export default function OrderRow({
    order,
}: {
    order: OrderListItem;
}) {
    return (
        <Paper
            elevation={2}
            component={Link}
            href={`/orders/${order.orderId}`}
            sx={{
                p: 2,
                textDecoration: "none",
                display: "block",
            }}
        >
            <Stack
                direction="row"
                spacing={1}
                justifyContent="space-between"
            >
                <Stack spacing={0.25}>
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >
                        <Typography fontWeight={600}>
                            {order.orderNumber}
                        </Typography>

                        {order.isStaffOrder && (
                            <Chip
                                size="small"
                                label="Staff"
                            />
                        )}
                    </Stack>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Placed: {formatDateTime(order.createdAt)}
                    </Typography>
                </Stack>

                <Stack spacing={0.25}>
                    <Typography fontWeight={600} align="right">
                        {formatINR(order.total)}
                    </Typography>

                    <OrderStatusBadge
                        status={order.status}
                    />
                </Stack>
            </Stack>
        </Paper>
    );
}