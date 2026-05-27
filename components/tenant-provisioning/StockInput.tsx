"use client";

import { useState } from "react";
import { Alert, Snackbar, TextField } from "@mui/material";
import { provisionProduct } from "@/lib/api/tenantInventory";
import type { TenantProvisioningRow } from "@/lib/mappers/tenantProvisioningView";

type Props = {
    tenantId: string;
    row: TenantProvisioningRow;
    onChange(stock: number): void;
};

export default function StockInput({ tenantId, row, onChange }: Props) {
    const [value, setValue] = useState(row.stock);
    const [error, setError] = useState<string | null>(null);

    async function commit() {

        try {
            await provisionProduct(tenantId, {
                productId: row.product.productId,
                enabled: row.enabled,
                stock: value,
            });

            onChange(value);
        } catch (err: unknown) {

            setValue(row.stock);

            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to update stock");
            }
        }
    }

    return (
        <>
            <TextField
                type="number"
                size="small"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                onBlur={commit}
            />

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