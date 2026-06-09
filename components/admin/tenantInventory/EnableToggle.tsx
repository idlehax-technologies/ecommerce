"use client";

import { useState } from "react";

import { Alert, Snackbar, Switch, Tooltip } from "@mui/material";

import { provisionProduct } from "@/lib/api/tenantInventory";

import type { TenantProvisioningRow } from "@/lib/mappers/tenantProvisioningView";

type Props = {
    tenantId: string;
    row: TenantProvisioningRow;
    onChange(enabled: boolean): void;
    disabled?: boolean;
};

export default function EnableToggle({ tenantId, row, onChange, disabled }: Props) {

    const [error, setError] = useState<string | null>(null);

    const isBlocked = row.reserved > 0 && row.enabled;

    async function toggle(e: React.ChangeEvent<HTMLInputElement>) {
        const enabled = e.target.checked;

        try {
            await provisionProduct(tenantId, {
                productId: row.product.productId,
                enabled,
            });

            onChange(enabled);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to update provisioning");
            }
        }
    }

    const toggleSwitch = (
        <Switch
            checked={row.enabled}
            onChange={toggle}
            disabled={disabled || isBlocked}
        />
    );

    return (
        <>
            {isBlocked ? (
                <Tooltip title="Cannot disable while orders are pending">
                    <span>
                        {toggleSwitch}
                    </span>
                </Tooltip>
            ) : (
                toggleSwitch
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