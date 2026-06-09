"use client";

import { useState } from "react";

import {
    Alert,
    Snackbar,
    TextField,
    Button,
    Stack,
} from "@mui/material";

import { adjustStockBy } from "@/lib/api/stockAdjustment";

import type { TenantProvisioningRow } from "@/lib/mappers/tenantProvisioningView";

type Props = {
    tenantId: string;
    row: TenantProvisioningRow;
    onChange(stock: number): void;
};

function generateKey() {
    return crypto.randomUUID();
}

export default function AdjustmentInput({
    tenantId,
    row,
    onChange,
}: Props) {

    const [delta, setDelta] = useState<number | undefined>();

    const [error, setError] = useState<string | null>(null);

    async function apply() {

        if (
            delta === undefined ||
            delta === 0
        ) {
            return;
        }

        try {

            const result =
                await adjustStockBy(
                    tenantId,
                    {
                        idempotencyKey: generateKey(),
                        productId: row.product.productId,
                        delta,
                    }
                );

            onChange(result.updated.stock);

            setDelta(undefined);

        } catch (err: unknown) {

            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to adjust stock");
            }
        }
    }

    return (
        <>
            <Stack
                direction="row"
                spacing={1}
            >
                <TextField
                    size="small"
                    type="number"
                    placeholder="+5 / -2"
                    value={delta ?? ""}
                    onChange={(e) => {
                        const value = e.target.value;

                        setDelta(
                            value === ""
                                ? undefined
                                : Number(value)
                        );
                    }}
                />

                <Button
                    disabled={
                        delta === undefined ||
                        delta === 0
                    }
                    onClick={apply}
                >
                    Apply
                </Button>
            </Stack>

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