"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import OrderReceipt from "@/components/orders/OrderReceipt";

import { getOrder } from "@/lib/api/orders";

import type { Order } from "@/types/order";
import { Box, CircularProgress } from "@mui/material";

export default function ReceiptPage() {
    const { orderId } = useParams<{ orderId: string }>();

    const [order, setOrder] = useState<Order | null>(null);

    const [loading, setLoading] = useState(true);

    async function load() {
        try {
            setLoading(true);
            const res = await getOrder(orderId);
            setOrder(res.order);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [orderId]);

    if (loading) {
        return <CircularProgress />;
    }

    if (!order) {
        return null;
    }

    return (
        <Box
            sx={{
                background: "#f5f5f5",
                padding: "40px 0",
                minHeight: "100vh",
            }}
        >
            <OrderReceipt order={order} />
        </Box>
    );
}