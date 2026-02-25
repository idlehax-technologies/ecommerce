// components/tenant-provisioning/StockInput.tsx

"use client";

import { TextField } from "@mui/material";
import { useState } from "react";
import { provisionProduct } from "@/lib/api/tenantInventory";
import type { TenantProvisioningRow } from "@/lib/mappers/tenantProvisioningView";

type Props = {
    tenantId: string;
    row: TenantProvisioningRow;
    onChange(stock: number): void;
};

export default function StockInput({ tenantId, row, onChange }: Props) {
    const [value, setValue] = useState(row.stock);

    async function commit() {
        await provisionProduct(tenantId, {
            productId: row.product.productId,
            enabled: row.enabled,
            stock: value,
        });

        onChange(value);
    }

    return (
        <TextField
            type="number"
            size="small"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            onBlur={commit}
        />
    );
}