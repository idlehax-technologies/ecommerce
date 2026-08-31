"use client";

import { Stack } from "@mui/material";

import type { OrderListItem } from "@/types/order";

import OrderRow from "./OrderRow";

export default function OrdersList({
    orders,
}: {
    orders: OrderListItem[];
}) {
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