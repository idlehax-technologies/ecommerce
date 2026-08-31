"use client";

import { Stack } from "@mui/material";
import OrderItemRow from "./OrderItemRow";
import type { ItemSnapshot } from "@/types/order";

export default function OrderItemsList({
    items,
}: {
    items: ItemSnapshot[];
}) {
    return (
        <Stack spacing={2}>
            {items.map((item) => (
                <OrderItemRow key={item.productId} item={item} />
            ))}
        </Stack>
    );
}