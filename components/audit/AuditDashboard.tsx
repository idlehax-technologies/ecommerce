"use client";

import { useMemo, useState } from "react";

import {
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import AuditList from "./AuditList";

import type { AuditLog } from "@/types/audit";

type Props = {
    logs: AuditLog[];
};

export default function AuditDashboard({
    logs,
}: Props) {
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        const q = search.toLowerCase();

        return logs.filter((log) => (
            log.eventType
                .toLowerCase()
                .includes(q)

            ||

            log.entityType
                .toLowerCase()
                .includes(q)

            ||

            log.entityId
                .toLowerCase()
                .includes(q)

            ||

            log.actorId
                .toLowerCase()
                .includes(q)
        ));
    }, [
        logs,
        search,
    ]);

    return (
        <Stack spacing={2}>

            <TextField
                label="Search audit logs"
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
                fullWidth
            />

            {filtered.length > 0 && (
                <AuditList logs={filtered} />
            )}

            {filtered.length === 0 && (
                <Typography color="text.secondary">
                    No audit logs found.
                </Typography>
            )}

        </Stack>
    );
}