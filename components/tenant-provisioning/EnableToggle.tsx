// components/tenant-provisioning/EnableToggle.tsx

"use client";

import { Switch, Tooltip } from "@mui/material";
import { provisionProduct } from "@/lib/api/tenantInventory";
import type { TenantProvisioningRow } from "@/lib/mappers/tenantProvisioningView";

type Props = {
    tenantId: string;
    row: TenantProvisioningRow;
    onChange(enabled: boolean): void;
    disabled?: boolean;
};

export default function EnableToggle({ tenantId, row, onChange, disabled }: Props) {
    const isBlocked = row.reserved > 0 && row.enabled;

    async function toggle(e: React.ChangeEvent<HTMLInputElement>) {
        const enabled = e.target.checked;

        try {
            await provisionProduct(tenantId, {
                productId: row.product.productId,
                enabled,
                stock: row.stock,
            });

            onChange(enabled);
        } catch (err) {
            console.error(err);
            // optional: show snackbar if you already have one
        }
    }

    const toggleSwitch = (
        <Switch
            checked={row.enabled}
            onChange={toggle}
            disabled={disabled || isBlocked}
        />
    );

    if (isBlocked) {
        return (
            <Tooltip title="Cannot disable while orders are pending">
                <span>{toggleSwitch}</span>
            </Tooltip>
        );
    }

    return toggleSwitch;
}