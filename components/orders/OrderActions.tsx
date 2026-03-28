"use client";

import { useTransition } from "react";
import { Stack, Button } from "@mui/material";

import { cancelOrder, pickupOrder, refundOrder, expireOrder } from "@/lib/api/orders";
import type { Order } from "@/types/order";

export default function OrderActions({ order }: { order: Order }) {
    const [isPending, startTransition] = useTransition();

    function handleCancel() {
        startTransition(async () => {
            await cancelOrder(order.orderId);
            window.location.reload();
        });
    }

    function handlePickup() {
        startTransition(async () => {
            await pickupOrder(order.orderId);
            window.location.reload();
        });
    }

    return (
        <Stack direction="row" spacing={2}>

            {order.status === "RESERVED" && (
                <>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleCancel}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => {
                            startTransition(async () => {
                                await expireOrder(order.orderId);
                                window.location.reload();
                            });
                        }}
                        disabled={isPending}
                    >
                        Expire
                    </Button>
                </>
            )}

            {order.status === "PAID" && (
                <>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handlePickup}
                        disabled={isPending}
                    >
                        Mark Picked Up
                    </Button>

                    <Button
                        variant="outlined"
                        color="warning"
                        onClick={() => {
                            startTransition(async () => {
                                await refundOrder(order.orderId);
                                window.location.reload();
                            });
                        }}
                        disabled={isPending}
                    >
                        Refund
                    </Button>
                </>
            )}

        </Stack>
    );
}