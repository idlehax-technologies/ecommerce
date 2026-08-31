"use client";

import { useMemo, useState } from "react";

import {
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import type {
    OrderListItem,
} from "@/types/order";

import OrdersList
    from "./OrdersList";

type Props = {
    orders: OrderListItem[];
};

export default function OrdersDashboard({
    orders,
}: Props) {

    const [search, setSearch] =
        useState("");

    const filtered = useMemo(() => {

        const q =
            search.toLowerCase();

        return orders
            .filter((order) => (
                order.orderNumber
                    .toLowerCase()
                    .includes(q) ||

                order.status
                    .toLowerCase()
                    .includes(q) ||

                (
                    order.invoiceNumber &&
                    order.invoiceNumber
                        .toLowerCase()
                        .includes(q)
                ) ||

                (
                    order.isStaffOrder
                        ? "staff"
                        : "non-staff"
                ) === q
            ))
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );

    }, [
        orders,
        search,
    ]);

    return (
        <Stack spacing={2}>

            <TextField
                label="Search orders"
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
                fullWidth
            />

            {filtered.length > 0 && (
                <OrdersList
                    orders={filtered}
                />
            )}

            {filtered.length === 0 && (
                <Typography color="text.secondary">
                    No orders found.
                </Typography>
            )}

        </Stack>
    );
}