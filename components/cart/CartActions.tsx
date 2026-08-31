"use client";

import { Stack, Button } from "@mui/material";
import { useCart } from "@/contexts/CartContext";
import CheckoutAction from "./CheckoutAction";

export default function CartActions() {
    const { clear } = useCart();

    return (
        <Stack spacing={1}>
            <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={clear}
            >
                Clear Cart
            </Button>

            <CheckoutAction />
        </Stack>
    );
}