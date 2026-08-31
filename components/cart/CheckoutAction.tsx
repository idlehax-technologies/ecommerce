"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button, Snackbar, Alert } from "@mui/material";

import { checkout } from "@/lib/api/checkout";
import { useCart } from "@/contexts/CartContext";
import { useSnackbar } from "@/contexts/SnackbarContext";

export default function CheckoutAction() {
    const router = useRouter();

    const { cart, clear, refresh } = useCart();
    const { show } = useSnackbar();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function executeCheckout() {
        if (loading) {
            return;
        }

        if (!cart || cart.items.length === 0) {
            return;
        }

        setLoading(true);

        try {
            const res = await checkout();

            if ("removedItems" in res) {
                await refresh();
                show(
                    "Some cart items are no longer available and were removed",
                    "warning"
                );
                return;
            }

            await clear();
            router.push(`/orders/${res.order.orderId}`);

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to place order");
            }

        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Button
                variant="contained"
                fullWidth
                loading={loading}
                disabled={
                    !cart ||
                    cart.items.length === 0
                }
                onClick={executeCheckout}
            >
                Place Order
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