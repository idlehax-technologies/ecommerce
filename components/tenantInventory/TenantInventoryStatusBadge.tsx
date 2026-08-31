"use client";

import { Chip } from "@mui/material";

import type {
    TenantProvisioningRow,
} from "@/lib/mappers/tenantProvisioningView";

import {
    LOW_STOCK_THRESHOLD
} from "@/lib/tenantInventory/constants";

export default function TenantInventoryStatusBadge({
    row,
}: {
    row: TenantProvisioningRow;
}) {

    const cfg =
        !row.isProvisioned
            ? {
                label: "Not Provisioned",
                color: "default" as const,
            }
            : !row.enabled
                ? {
                    label: "Disabled",
                    color: "error" as const,
                }
                : row.available <= LOW_STOCK_THRESHOLD
                    ? {
                        label: "Low Stock",
                        color: "warning" as const,
                    }
                    : {
                        label: "Adequate Stock",
                        color: "success" as const,
                    };

    return (
        <Chip
            size="small"
            label={cfg.label}
            color={cfg.color}
        />
    );
}