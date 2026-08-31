"use client";

import {
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import { formatDateTime } from "@/lib/format/datetime";
import type { AuditLog } from "@/types/audit";

export default function AuditRow({
    log,
}: {
    log: AuditLog;
}) {
    return (
        <Paper
            elevation={2}
            sx={{ p: 2 }}
        >
            <Stack spacing={1}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography fontWeight={600}>
                        {log.eventType}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {formatDateTime(log.createdAt)}
                    </Typography>
                </Stack>

                <Stack>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {log.entityType}
                        {" • "}
                        {log.entityId}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Actor: {log.actorId}
                    </Typography>
                </Stack>

                <Stack>
                    {log.from && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            From: {JSON.stringify(log.from)}
                        </Typography>
                    )}

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        To: {JSON.stringify(log.to)}
                    </Typography>

                    {Object.keys(log.metadata).length > 0 && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Metadata: {JSON.stringify(log.metadata)}
                        </Typography>
                    )}
                </Stack>
            </Stack>
        </Paper>
    );
}