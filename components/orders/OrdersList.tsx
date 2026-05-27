"use client";

import { Stack, Typography } from "@mui/material";

import type { OrderListItem } from "@/types/order";

import OrderRow from "./OrderRow";

export default function OrdersList({
    orders,
}: {
    orders: OrderListItem[];
}) {

    if (orders.length === 0) {
        return (
            <Typography color="text.secondary">
                No orders yet.
            </Typography>
        );
    }

    return (
        <Stack spacing={2}>
            {orders.map((order) => (
                <OrderRow
                    key={order.orderId}
                    order={order}
                />
            ))}
        </Stack>
    );
}