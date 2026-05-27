"use client";

import { useState } from "react";

import {
    Stack,
    Typography,
    Button,
    ToggleButton,
    ToggleButtonGroup,
    Alert,
} from "@mui/material";

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

    const [method, setMethod] = useState<PaymentMethod | null>(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    async function handlePayment() {

        if (!method) return;

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
        <Stack spacing={2}>

            <Typography fontWeight={600}>
                Complete Payment
            </Typography>

            <ToggleButtonGroup
                exclusive
                value={method}
                onChange={(_, value: PaymentMethod | null) =>
                    setMethod(value)
                }
                size="small"
            >
                <ToggleButton value="CASH">
                    Cash
                </ToggleButton>

                <ToggleButton value="UPI">
                    UPI
                </ToggleButton>

                <ToggleButton value="CARD">
                    Card
                </ToggleButton>

                <ToggleButton value="NET_BANKING">
                    Net Banking
                </ToggleButton>

            </ToggleButtonGroup>

            {error && (
                <Alert severity="error">
                    {error}
                </Alert>
            )}

            <Button
                variant="contained"
                disabled={!method || loading}
                onClick={handlePayment}
            >
                {loading
                    ? "Processing..."
                    : "Pay Now"}
            </Button>

        </Stack>
    );
}