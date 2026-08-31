"use client";

import { Chip } from "@mui/material";
import type { JobStatus } from "@/types/job";

export default function JobStatusBadge({
    status,
}: {
    status: JobStatus;
}) {
    const map = {
        PENDING: { label: "Pending", color: "warning" as const },
        RUNNING: { label: "Running", color: "info" as const },
        SUCCESS: { label: "Success", color: "success" as const },
        FAILED: { label: "Failed", color: "error" as const },
    };

    const cfg = map[status];
    return <Chip size="small" label={cfg.label} color={cfg.color} />;
}