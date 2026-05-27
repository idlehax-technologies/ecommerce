"use client";

import { Container, Typography, Box, CircularProgress } from "@mui/material";

import { getAuditLogs } from "@/lib/api/audit";

import AuditTimeline from "@/components/audit/AuditTimeline";
import { useEffect, useState } from "react";
import { AuditLog } from "@/types/audit";

export default function AuditPage() {

    const [logs, setLogs] = useState<AuditLog[]>([]);

    const [loading, setLoading] = useState(true);

    async function load() {
        try {
            setLoading(true);
            const res = await getAuditLogs();
            setLogs(res.logs);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container sx={{ mt: 6 }}>

            <Typography variant="h4">
                Audit Logs
            </Typography>

            <Box mt={3}>
                <AuditTimeline logs={logs} />
            </Box>

        </Container>
    );
}