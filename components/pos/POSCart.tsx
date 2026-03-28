"use client";

import { useState } from "react";
import {
    Stack,
    Typography,
    Button,
    Divider,
    ToggleButtonGroup,
    ToggleButton,
    IconButton,
    Box,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

type Row = {
    product: {
        productId: string;
        title: string;
        price: number;
    };
    stock: number;
};

export default function POSCart({
    cart,
    rows,
    onUpdate,
    onSubmit,
}: {
    cart: Record<string, number>;
    rows: Row[];
    onUpdate: (productId: string, qty: number) => void;
    onSubmit: (method?: string) => void;
}) {
    const [method, setMethod] = useState<string | null>(null);

    const items = Object.entries(cart) as [string, number][];

    const total = items.reduce((sum, [id, qty]) => {
        const row = rows.find((r) => r.product.productId === id);
        if (!row) return sum;
        return sum + row.product.price * qty;
    }, 0);

    return (
        <Stack spacing={2}>
            <Typography variant="h6">POS Cart</Typography>

            {items.map(([id, qty]) => {
                const row = rows.find((r) => r.product.productId === id);
                if (!row) return null;

                return (
                    <Box
                        key={id}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography>
                            {row.product.title}
                        </Typography>

                        <Box display="flex" alignItems="center" gap={1}>
                            <IconButton
                                onClick={() => onUpdate(id, qty - 1)}
                            >
                                <RemoveIcon />
                            </IconButton>

                            <Typography>
                                {qty} reserved • {row.stock - qty} left
                            </Typography>

                            <IconButton
                                disabled={qty >= row.stock}
                                onClick={() => onUpdate(id, qty + 1)}
                            >
                                <AddIcon />
                            </IconButton>

                            <IconButton
                                color="error"
                                onClick={() => onUpdate(id, 0)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Box>
                );
            })}

            <Divider />

            <Typography fontWeight={600}>
                ₹ {(total / 100).toFixed(2)}
            </Typography>

            <ToggleButtonGroup
                exclusive
                value={method}
                onChange={(_, v) => setMethod(v)}
                size="small"
            >
                <ToggleButton value="CASH">Cash</ToggleButton>
                <ToggleButton value="UPI">UPI</ToggleButton>
                <ToggleButton value="CARD">Card</ToggleButton>
                <ToggleButton value="NET_BANKING">Net</ToggleButton>
            </ToggleButtonGroup>

            <Button
                variant="contained"
                disabled={items.length === 0}
                onClick={() => onSubmit(method ?? undefined)}
            >
                Create Order
            </Button>
        </Stack>
    );
}