"use client";

import { useState } from "react";

import {
    Paper,
    Stack,
    Button,
    Divider,
    Snackbar,
} from "@mui/material";

import { useCart } from "@/contexts/CartContext";

import CartItemsList from "./CartItemsList";
import CartSummary from "./CartSummary";
import CartActions from "./CartActions";

import type {
    TenantProductRow,
} from "@/lib/mappers/tenantProductView";
import type { CartView } from "@/lib/mappers/cartView";

export default function CartDetail({
    cart,
    rows,
    hasGst,
}: {
    cart: CartView;
    rows: TenantProductRow[];
    hasGst: boolean;
}) {
    const { remove } = useCart();

    const [undoAction, setUndoAction] = useState<(() => void) | null>(null);
    const [open, setOpen] = useState(false);

    function registerUndo(undo: () => void) {
        setUndoAction(() => undo);
        setOpen(true);
    }

    function handleUndo() {
        undoAction?.();
        setOpen(false);
    }

    return (
        <>
            <Paper elevation={2} sx={{ p: 2 }}>
                <Stack spacing={2}>
                    <CartItemsList
                        cart={cart}
                        rows={rows}
                        removeItem={remove}
                        registerUndo={registerUndo}
                    />

                    <Divider />

                    <CartSummary
                        items={cart.items}
                        hasGst={hasGst}
                    />

                    <Divider />

                    <CartActions />
                </Stack>
            </Paper>

            <Snackbar
                open={open}
                autoHideDuration={3000}
                message="Item removed from cart"
                onClose={() => setOpen(false)}
                action={
                    <Button
                        size="small"
                        onClick={handleUndo}
                    >
                        UNDO
                    </Button>
                }
            />
        </>
    );
}