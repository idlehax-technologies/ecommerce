"use client";

import {
    Box,
    Stack,
    Typography,
} from "@mui/material";

import { getPOSTotals } from "@/lib/calculations/pricing";
import { formatINR } from "@/lib/format/currency";

import type {
    TenantProductRow
} from "@/lib/mappers/tenantProductView";

type Props = {
    cart: Record<string, number>;
    rows: TenantProductRow[];
    hasGst: boolean;
};

export default function POSSummary({
    cart,
    rows,
    hasGst,
}: Props) {

    const { mrpTotal, payableTotal, savings } =
        getPOSTotals(cart, rows);

    return (
        <Stack spacing={0.5}>

            {savings > 0 && (
                <Box
                    display="flex"
                    justifyContent="space-between"
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
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
                <Box
                    display="flex"
                    justifyContent="space-between"
                >
                    <Typography
                        variant="body2"
                        color="success.main"
                    >
                        Savings
                    </Typography>

                    <Typography
                        variant="body2"
                        color="success.main"
                    >
                        {formatINR(savings)}
                    </Typography>
                </Box>
            )}

            <Box
                display="flex"
                justifyContent="space-between"
            >
                <Typography fontWeight={600}>
                    Total
                </Typography>

                <Typography fontWeight={600}>
                    {formatINR(payableTotal)}
                    {hasGst && " (incl. GST)"}
                </Typography>
            </Box>

        </Stack>
    );
}