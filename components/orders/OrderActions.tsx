"use client";

import { useState } from "react";

import { Stack, Button } from "@mui/material";

import {
    cancelOrder,
    pickupOrder,
    refundOrder,
} from "@/lib/api/orders";

import type { Order } from "@/types/order";

export default function OrderActions({
    order,
    reload,
}: {
    order: Order;
    reload: () => Promise<void>;
}) {

    const [loading, setLoading] = useState(false);

    async function load(
        action: () => Promise<unknown>
    ) {
        try {
            setLoading(true);
            await action();
            await reload();
        } finally {
            setLoading(false);
        }
    }

    return (
        <Stack direction="row" spacing={2}>

            {order.status === "RESERVED" && (

                <Button
                    variant="contained"
                    color="error"
                    disabled={loading}
                    onClick={() =>
                        load(() =>
                            cancelOrder(order.orderId)
                        )
                    }
                >
                    Cancel
                </Button>

            )}

            {order.status === "PAID" && (
                <>

                    <Button
                        variant="contained"
                        color="success"
                        disabled={loading}
                        onClick={() =>
                            load(() =>
                                pickupOrder(order.orderId)
                            )
                        }
                    >
                        Mark Picked Up
                    </Button>

                    <Button
                        variant="outlined"
                        color="warning"
                        disabled={loading}
                        onClick={() =>
                            load(() =>
                                refundOrder(order.orderId)
                            )
                        }
                    >
                        Refund
                    </Button>

                </>
            )}

        </Stack>
    );
}