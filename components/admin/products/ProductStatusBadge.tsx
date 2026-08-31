"use client";

import { Chip } from "@mui/material";
import type { ProductStatus } from "@/types/product";

export default function ProductStatusBadge({
    status,
}: {
    status: ProductStatus;
}) {
    const map = {
        ACTIVE: { label: "Active", color: "success" as const },
        INACTIVE: { label: "Inactive", color: "warning" as const },
    };

    const cfg = map[status];
    return <Chip size="small" label={cfg.label} color={cfg.color} />;
}