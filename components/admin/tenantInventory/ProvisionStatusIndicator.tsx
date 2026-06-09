"use client";

import { Chip } from "@mui/material";

import type { TenantProvisioningRow } from "@/lib/mappers/tenantProvisioningView";

const LOW_STOCK_THRESHOLD = 5;

type Props = {
    row: TenantProvisioningRow;
};

export default function ProvisionStatusIndicator({
    row,
}: Props) {

    if (!row.isProvisioned) {
        return <Chip label="Not Provisioned" />;
    }

    if (!row.enabled) {
        return <Chip label="Disabled" color="warning" />;
    }

    if (row.available <= LOW_STOCK_THRESHOLD) {
        return <Chip label="Low Stock" color="error" />;
    }

    return <Chip label="Adequate Stock" color="success" />;
}