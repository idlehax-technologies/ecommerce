"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, CircularProgress } from "@mui/material";

import { checkout } from "@/lib/api/checkout";
import { useCart } from "@/contexts/CartContext";
import type { CheckoutRequest } from "@/types/checkout";

export default function CheckoutButton() {
    const router = useRouter();
    const { cart, clear } = useCart();

    const [loading, setLoading] = useState(false);

    async function handleCheckout() {
        if (loading) return;
        if (!cart || cart.items.length === 0) return;

        setLoading(true);

        const payload: CheckoutRequest = {
            items: cart.items
                .filter((i) => i.quantity > 0)
                .map((i) => ({
                    productId: i.productId,
                    quantity: i.quantity,
                })),
        };

        try {
            const res = await checkout(payload);

            if (res.success) {
                await clear();
                router.push(`/orders/${res.orderId}`);
            }
        } catch {
            // backend error handling handled by route layer
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            variant="contained"
            size="large"
            fullWidth
            disabled={loading || !cart || cart.items.length === 0}
            onClick={handleCheckout}
        >
            {loading ? <CircularProgress size={22} /> : "Place Order"}
        </Button>
    );
}