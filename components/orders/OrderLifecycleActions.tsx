"use client";

import { useState } from "react";
import { Stack, Button } from "@mui/material";

import {
    cancelOrder,
    payOrder,
    pickupOrder,
    refundOrder,
} from "@/lib/api/orders";
import {
    confirmPayment
} from "@/lib/api/payments";

import type { Order } from "@/types/order";
import { PaymentMethod } from "@/types/payment";

export default function OrderLifecycleActions({
    order,
    reload,
}: {
    order: Order;
    reload: () => Promise<void>;
}) {
    const method: PaymentMethod = "CASH";

    const [loading, setLoading] = useState(false);

    async function executeAction(
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
                <>
                    <Button
                        variant="contained"
                        color="success"
                        disabled={loading}
                        onClick={() =>
                            executeAction(async () => {
                                await payOrder(order.orderId, method);
                                await confirmPayment(order.orderId);
                            })
                        }
                    >
                        Confirm Payment
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        disabled={loading}
                        onClick={() =>
                            executeAction(() =>
                                cancelOrder(order.orderId)
                            )
                        }
                    >
                        Cancel Order
                    </Button>
                </>
            )}

            {order.status === "PAID" && (
                <>
                    <Button
                        variant="contained"
                        color="success"
                        disabled={loading}
                        onClick={() =>
                            executeAction(() =>
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
                            executeAction(() =>
                                refundOrder(order.orderId)
                            )
                        }
                    >
                        Refund Order
                    </Button>
                </>
            )}
        </Stack>
    );
}