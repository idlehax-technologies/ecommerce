"use client";

import { Stack, Paper, Typography } from "@mui/material";
import type { AuditLog } from "@/types/audit";

export default function AuditTimeline({ logs }: { logs: AuditLog[] }) {
    return (
        <Stack spacing={2}>
            {logs.map(l => (
                <Paper key={l.auditId} sx={{ p: 2 }}>
                    <Typography fontWeight={600}>{l.eventType}</Typography>
                    <Typography variant="body2">
                        {l.entityType} ({l.entityId})
                    </Typography>
                    <Typography variant="body2">
                        Actor: {l.actorId}
                    </Typography>

                    {l.from && (
                        <Typography variant="body2">
                            From: {JSON.stringify(l.from)}
                        </Typography>
                    )}
                    {l.to && (
                        <Typography variant="body2">
                            To: {JSON.stringify(l.to)}
                        </Typography>
                    )}

                    <Typography variant="caption">
                        {new Date(l.createdAt).toLocaleString()}
                    </Typography>
                </Paper>
            ))}
        </Stack>
    );
}