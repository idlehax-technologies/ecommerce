"use client";

import {
    Box,
    Divider,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

import type {
    TenantProductRow,
} from "@/lib/mappers/tenantProductView";

import POSSummary from "./POSSummary";
import POSCheckoutAction from "./POSCheckoutAction";

type Props = {
    cart: Record<string, number>;
    rows: TenantProductRow[];
    hasGst: boolean;
    onUpdate: (
        productId: string,
        quantity: number
    ) => void;
    onSubmit: () => Promise<void>;
};

export default function POSCart({
    cart,
    rows,
    hasGst,
    onUpdate,
    onSubmit,
}: Props) {

    const items =
        Object.entries(cart) as [string, number][];

    return (
        <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600}>
                POS Cart
            </Typography>

            {items.length === 0 && (
                <Typography color="text.secondary">
                    No products added.
                </Typography>
            )}

            {items.map(([productId, quantity]) => {

                const row =
                    rows.find((row) =>
                        row.product.productId === productId
                    );

                if (!row) {
                    return null;
                }

                const remaining = row.available - quantity;

                return (
                    <Box
                        key={productId}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Stack spacing={0.25}>
                            <Typography fontWeight={600}>
                                {row.product.title}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {quantity}
                                {" in cart • "}
                                {remaining}
                                {" left"}
                            </Typography>
                        </Stack>

                        <Stack
                            direction="row"
                            alignItems="center"
                        >
                            <IconButton
                                onClick={() =>
                                    onUpdate(productId, quantity - 1)
                                }
                            >
                                <RemoveIcon />
                            </IconButton>

                            <IconButton
                                disabled={remaining <= 0}
                                onClick={() =>
                                    onUpdate(productId, quantity + 1)
                                }
                            >
                                <AddIcon />
                            </IconButton>

                            <IconButton
                                color="error"
                                onClick={() =>
                                    onUpdate(productId, 0)
                                }
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Stack>
                    </Box>
                );
            })}

            <Divider />

            <POSSummary
                cart={cart}
                rows={rows}
                hasGst={hasGst}
            />

            <Divider />

            <POSCheckoutAction
                disabled={items.length === 0}
                onSubmit={onSubmit}
            />
        </Stack>
    );
}