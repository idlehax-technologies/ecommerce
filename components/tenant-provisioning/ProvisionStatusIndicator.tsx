// components/tenant-provisioning/ProvisionStatusIndicator.tsx

import { Chip } from "@mui/material";
import type { TenantProvisioningRow } from "@/lib/mappers/tenantProvisioningView";

type Props = { row: TenantProvisioningRow };

export default function ProvisionStatusIndicator({ row }: Props) {
    if (!row.isProvisioned) return <Chip label="Not Provisioned" />;
    if (!row.enabled) return <Chip label="Disabled" color="warning" />;
    return <Chip label="Enabled" color="success" />;
}