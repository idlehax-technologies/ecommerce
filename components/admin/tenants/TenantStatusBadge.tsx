"use client";

import { Chip } from "@mui/material";
import type { TenantStatus } from "@/types/tenant";

export default function TenantStatusBadge({
    status,
}: {
    status: TenantStatus;
}) {
    const map = {
        ACTIVE: { label: "Active", color: "success" as const },
        SUSPENDED: { label: "Suspended", color: "warning" as const },
        ARCHIVED: { label: "Archived", color: "default" as const },
        PENDING: { label: "Pending", color: "default" as const },
    };

    const cfg = map[status];
    return <Chip size="small" label={cfg.label} color={cfg.color} />;
}