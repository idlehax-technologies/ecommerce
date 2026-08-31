"use client";

import {
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import { getDiscountedPrice } from "@/lib/calculations/pricing";
import { formatINR } from "@/lib/format/currency";

import type { ItemSnapshot } from "@/types/order";

export default function OrderItemRow({
    item,
}: {
    item: ItemSnapshot;
}) {
    const discountedPrice =
        getDiscountedPrice(item.price, item.discountPercent);

    const discountedAmount = discountedPrice * item.quantity;

    return (
        <Paper
            elevation={2}
            sx={{ p: 2 }}
        >
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
        </Paper>
    );
}