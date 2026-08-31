"use client";

import { Box, Typography, Stack } from "@mui/material";
import OrderStatusBadge from "./OrderStatusBadge";
import { getOrderTotals } from "@/lib/calculations/pricing";
import { formatINR } from "@/lib/format/currency";
import type { Order } from "@/types/order";

export default function OrderSummary({
    order,
    hasGst,
}: {
    order: Order;
    hasGst: boolean;
}) {
    const { mrpTotal, savings } = getOrderTotals(order.items);

    return (
        <Stack spacing={0.5}>
            {savings > 0 && (
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                        MRP
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{ textDecoration: "line-through" }}
                    >
                        {formatINR(mrpTotal)}
                    </Typography>
                </Box>
            )}

            {savings > 0 && (
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="success.main">
                        Savings
                    </Typography>

                    <Typography variant="body2" color="success.main">
                        {formatINR(savings)}
                    </Typography>
                </Box>
            )}

            <Box display="flex" justifyContent="space-between">
                <Typography fontWeight={600}>
                    Total
                </Typography>

                <Typography fontWeight={600}>
                    {formatINR(order.total)}
                    {hasGst && " (incl. GST)"}
                </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                    Payment
                </Typography>

                <Typography variant="body2">
                    {order.paymentMethod ?? "Awaiting Payment"}
                </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                    Status
                </Typography>

                <OrderStatusBadge
                    status={order.status}
                />
            </Box>
        </Stack>
    );
}