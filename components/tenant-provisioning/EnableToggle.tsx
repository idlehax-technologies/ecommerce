// components/tenant-provisioning/EnableToggle.tsx

"use client";

import { Switch } from "@mui/material";
import { provisionProduct } from "@/lib/api/tenantInventory";
import type { TenantProvisioningRow } from "@/lib/mappers/tenantProvisioningView";

type Props = {
    tenantId: string;
    row: TenantProvisioningRow;
    onChange(enabled: boolean): void;
    disabled?: boolean;
};

export default function EnableToggle({ tenantId, row, onChange, disabled }: Props) {
    async function toggle(e: React.ChangeEvent<HTMLInputElement>) {
        const enabled = e.target.checked;

        await provisionProduct(tenantId, {
            productId: row.product.productId,
            enabled,
            stock: row.stock,
        });

        onChange(enabled);
    }

    return (
        <Switch
            checked={row.enabled}
            onChange={toggle}
            disabled={disabled}
        />
    );
}