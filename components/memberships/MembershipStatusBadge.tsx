"use client";

import { Chip } from "@mui/material";
import type { MembershipStatus } from "@/types/membership";

export default function MembershipStatusBadge({
    status,
}: {
    status: MembershipStatus;
}) {
    const map = {
        PENDING: { label: "Pending", color: "warning" as const },
        APPROVED: { label: "Approved", color: "success" as const },
        REJECTED: { label: "Rejected", color: "error" as const },
        REVOKED: { label: "Revoked", color: "default" as const },
        EXPIRED: { label: "Expired", color: "default" as const },
    };

    const cfg = map[status];
    return <Chip size="small" label={cfg.label} color={cfg.color} />;
}