"use client";

import { useState } from "react";

import { useRouter }
    from "next/navigation";

import {
    Button,
    CircularProgress,
    Snackbar,
    Alert,
} from "@mui/material";

import { checkout }
    from "@/lib/api/checkout";

import { useCart }
    from "@/contexts/CartContext";

export default function CheckoutButton() {

    const router = useRouter();

    const {
        cart,
        clear,
    } = useCart();

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    async function handleCheckout() {

        if (loading) return;

        if (
            !cart ||
            cart.items.length === 0
        ) {
            return;
        }

        setLoading(true);

        try {

            const res =
                await checkout();

            await clear();

            router.push(
                `/orders/${res.order.orderId}`
            );

        } catch (err: unknown) {

            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(
                    "Checkout failed"
                );
            }

        } finally {
            setLoading(false);
        }
    }

    return (
        <>

            <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={
                    loading ||
                    !cart ||
                    cart.items.length === 0
                }
                onClick={handleCheckout}
            >

                {loading
                    ? <CircularProgress size={22} />
                    : "Place Order"
                }

            </Button>

            <Snackbar
                open={!!error}
                autoHideDuration={3000}
                onClose={() => setError(null)}
            >

                <Alert
                    severity="error"
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>

            </Snackbar>

        </>
    );
}