"use client";

import { useState } from "react";

import { Button, Alert } from "@mui/material";

import { payOrder } from "@/lib/api/orders";
import { confirmPayment } from "@/lib/api/payments";

import type { PaymentMethod } from "@/types/payment";

export default function OrderPaymentSection({
    orderId,
    reload,
}: {
    orderId: string;
    reload: () => Promise<void>;
}) {
    const method: PaymentMethod = "UPI";

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    async function handlePayment() {

        try {
            setLoading(true);
            setError(null);

            await payOrder(orderId, method);
            await confirmPayment(orderId);

            await reload();

        } catch (err: unknown) {

            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Payment failed");
            }

        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {error && (
                <Alert severity="error">
                    {error}
                </Alert>
            )}

            <Button
                variant="contained"
                disabled={loading}
                onClick={handlePayment}
            >
                {loading
                    ? "Processing..."
                    : "Pay with UPI"}
            </Button>
        </>
    );
}