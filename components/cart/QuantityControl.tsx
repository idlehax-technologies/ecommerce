"use client";

import { useMemo, useState } from "react";
import {
    Box,
    Button,
    IconButton,
    Typography,
    CircularProgress,
    Snackbar,
    Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { useCart } from "@/contexts/CartContext";

type Props = {
    productId: string;
    stock: number;
};

export default function QuantityControl({ productId, stock }: Props) {
    const { cart, add, update } = useCart();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const quantity = useMemo(() => {
        const item = cart?.items.find((i) => i.productId === productId);
        return item?.quantity ?? 0;
    }, [cart, productId]);

    async function handleAdd() {
        if (stock <= 0) return;

        try {
            setLoading(true);
            await add(productId);
        } catch (err: any) {
            setError(err?.message ?? "Failed to add item");
        } finally {
            setLoading(false);
        }
    }

    async function handleIncrease() {
        if (quantity >= stock) return;

        try {
            setLoading(true);
            await update(productId, quantity + 1);
        } catch (err: any) {
            setError(err?.message ?? "Failed to update quantity");
        } finally {
            setLoading(false);
        }
    }

    async function handleDecrease() {
        if (quantity === 0) return;

        try {
            setLoading(true);

            if (quantity === 1) {
                await update(productId, 0); // removal
            } else {
                await update(productId, quantity - 1);
            }
        } catch (err: any) {
            setError(err?.message ?? "Failed to update quantity");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight={40}>
                    <CircularProgress size={20} />
                </Box>
            ) : quantity === 0 ? (
                <Button
                    variant="contained"
                    size="large"
                    disabled={stock <= 0}
                    onClick={handleAdd}
                >
                    Add to Cart
                </Button>
            ) : (
                <Box display="flex" alignItems="center" gap={2}>
                    <IconButton
                        color="primary"
                        disabled={loading || quantity === 0}
                        onClick={handleDecrease}
                    >
                        <RemoveIcon />
                    </IconButton>

                    <Typography fontWeight={600}>
                        {quantity}
                    </Typography>

                    <IconButton
                        color="primary"
                        disabled={loading || quantity >= stock}
                        onClick={handleIncrease}
                    >
                        <AddIcon />
                    </IconButton>
                </Box>
            )}

            <Snackbar
                open={!!error}
                autoHideDuration={3000}
                onClose={() => setError(null)}
            >
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
}