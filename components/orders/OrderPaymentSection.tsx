"use client";

import { useState, useTransition } from "react";
import {
    Stack,
    Typography,
    Button,
    ToggleButton,
    ToggleButtonGroup,
    Alert,
} from "@mui/material";

import { payOrder } from "@/lib/api/orders";

type PaymentMethod = "CASH" | "UPI" | "CARD" | "NET_BANKING";

export default function OrderPaymentSection({
    orderId,
}: {
    orderId: string;
}) {
    const [method, setMethod] = useState<PaymentMethod | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handlePay = () => {
        if (!method) return;

        setError(null);

        startTransition(async () => {
            try {
                await payOrder(orderId, method);

                // 🔥 simulate async confirmation
                setTimeout(async () => {
                    await fetch(`/api/payments/${orderId}/confirm`, {
                        method: "POST",
                    });

                    window.location.reload();
                }, 1500);

            } catch (err: any) {
                setError(err.message || "Payment failed");
            }
        });
    };

    return (
        <Stack spacing={2}>
            <Typography fontWeight={600}>
                Complete Payment
            </Typography>

            <ToggleButtonGroup
                exclusive
                value={method}
                onChange={(_, val) => setMethod(val)}
                size="small"
            >
                <ToggleButton value="CASH">Cash</ToggleButton>
                <ToggleButton value="UPI">UPI</ToggleButton>
                <ToggleButton value="CARD">Card</ToggleButton>
                <ToggleButton value="NET_BANKING">
                    Net Banking
                </ToggleButton>
            </ToggleButtonGroup>

            {error && <Alert severity="error">{error}</Alert>}

            <Button
                variant="contained"
                disabled={!method || isPending}
                onClick={handlePay}
            >
                {isPending ? "Processing..." : "Pay Now"}
            </Button>
        </Stack>
    );
}