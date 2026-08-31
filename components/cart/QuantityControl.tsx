"use client";

import { useMemo, useState } from "react";

import {
    Box,
    Typography,
    Button,
    IconButton,
    Snackbar,
    Alert,
    CircularProgress,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { useCart } from "@/contexts/CartContext";

type Props = {
    productId: string;
    available: number;
};

export default function QuantityControl({
    productId,
    available,
}: Props) {

    const { cart, add, update } = useCart();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const quantity = useMemo(() => {
        const item = cart?.items.find(
            (item) => item.productId === productId
        );

        return item?.quantity ?? 0;
    }, [
        cart,
        productId,
    ]);

    const remaining = available - quantity;

    async function execute(
        action: () => Promise<void>
    ) {
        if (loading) {
            return;
        }

        try {
            setLoading(true);
            await action();

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to update cart");
            }

        } finally {
            setLoading(false);
        }
    }

    async function handleAdd() {
        if (remaining <= 0) {
            return;
        }

        await execute(() =>
            add(productId)
        );
    }

    async function handleIncrease() {
        if (remaining <= 0) {
            return;
        }

        await execute(() =>
            update(productId, quantity + 1)
        );
    }

    async function handleDecrease() {
        if (quantity <= 0) {
            return;
        }

        await execute(() =>
            update(productId, quantity - 1)
        );
    }

    return (
        <>
            {quantity === 0 ? (
                <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    disabled={loading || remaining <= 0}
                    onClick={handleAdd}
                    sx={{
                        minHeight: 34,
                        fontWeight: 600,
                    }}
                >
                    {loading
                        ? (
                            <CircularProgress
                                size={18}
                                color="inherit"
                            />
                        )
                        : "ADD"}
                </Button>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        border: 1,
                        borderColor: "primary.main",
                        borderRadius: 1,
                        px: 0.5,
                        py: 0.25,
                        minHeight: 34,
                    }}
                >
                    <IconButton
                        size="small"
                        disabled={loading}
                        onClick={handleDecrease}
                    >
                        <RemoveIcon
                            fontSize="small"
                        />
                    </IconButton>

                    {loading ? (
                        <CircularProgress
                            size={16}
                            color="inherit"
                        />
                    ) : (
                        <Typography fontWeight={600}>
                            {quantity}
                        </Typography>
                    )}

                    <IconButton
                        size="small"
                        disabled={loading || remaining <= 0}
                        onClick={handleIncrease}
                    >
                        <AddIcon
                            fontSize="small"
                        />
                    </IconButton>
                </Box>
            )}

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