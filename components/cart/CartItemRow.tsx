"use client";

import { useRef, useState, useEffect } from "react";

import {
    Paper,
    Stack,
    Typography,
    IconButton,
    Divider,
    Collapse,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import QuantityControl from "./QuantityControl";

import { getDiscountedPrice } from "@/lib/calculations/pricing";
import { formatINR } from "@/lib/format/currency";

import type {
    TenantProductRow,
} from "@/lib/mappers/tenantProductView";
import type { CartItemView } from "@/lib/mappers/cartView";

export default function CartItemRow({
    item,
    row,
    removeItem,
    registerUndo,
}: {
    item: CartItemView;
    row: TenantProductRow;
    removeItem?: (productId: string) => Promise<void>;
    registerUndo?: (undo: () => void) => void;
}) {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [visible, setVisible] = useState(true);

    const discountedPrice = getDiscountedPrice(
        item.price,
        item.discountPercent
    );

    const discountedAmount = discountedPrice * item.quantity;

    function startRemove() {
        if (!removeItem || !registerUndo) {
            return;
        }

        setVisible(false);

        timerRef.current = setTimeout(() => {
            removeItem(item.productId);
        }, 3000);

        registerUndo(undo);
    }

    function undo() {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        setVisible(true);
    }

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return (
        <Collapse in={visible} timeout={200}>
            <Paper
                elevation={2}
                sx={{ p: 2 }}
            >
                <Stack spacing={1.5}>
                    <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="space-between"
                    >
                        <Stack spacing={0.25}>
                            <Typography fontWeight={600}>
                                {item.title}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Qty: {item.quantity}
                                {" × "}
                                {formatINR(discountedPrice)}

                                {item.discountPercent > 0 && (
                                    <>
                                        {" • "}
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ textDecoration: "line-through" }}
                                        >
                                            {formatINR(item.price)}
                                        </Typography>
                                        {" MRP"}
                                    </>
                                )}
                            </Typography>
                        </Stack>

                        <Stack
                            spacing={0.25}
                            alignItems="flex-end"
                        >
                            <Typography fontWeight={600}>
                                {formatINR(discountedAmount)}
                            </Typography>

                            {item.discountPercent > 0 && (
                                <Typography
                                    variant="body2"
                                    color="success.main"
                                >
                                    {item.discountPercent}% OFF
                                </Typography>
                            )}
                        </Stack>
                    </Stack>

                    <Divider />

                    <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="space-between"
                    >
                        <QuantityControl
                            productId={item.productId}
                            available={row.available}
                        />

                        {removeItem && registerUndo && (
                            <IconButton
                                size="small"
                                color="error"
                                onClick={startRemove}
                                sx={{
                                    aspectRatio: "3",
                                    border: 1,
                                    borderColor: "error.main",
                                    borderRadius: 1,
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Stack>
                </Stack>
            </Paper>
        </Collapse>
    );
}