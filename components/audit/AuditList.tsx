"use client";

import { Stack } from "@mui/material";

import AuditRow from "./AuditRow";

import type { AuditLog } from "@/types/audit";

export default function AuditList({
    logs,
}: {
    logs: AuditLog[];
}) {
    return (
        <Stack spacing={2}>
            {logs.map((log) => (
                <AuditRow
                    key={log.auditId}
                    log={log}
                />
            ))}
        </Stack>
    );
}