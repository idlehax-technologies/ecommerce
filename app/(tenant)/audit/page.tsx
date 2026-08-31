"use client";

import { useEffect, useState } from "react";

import {
    Container,
    Box,
    Stack,
    Typography,
    Divider,
    Paper,
    CircularProgress,
} from "@mui/material";

import AuditDashboard from "@/components/audit/AuditDashboard";
import { getAuditLogs } from "@/lib/api/audit";
import type { AuditLog } from "@/types/audit";

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
        <Container maxWidth="md">
            <Stack spacing={3} sx={{ p: 6 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Audit Logs
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Browse system activity and event history
                    </Typography>
                </Box>

                <Divider />

                <Paper elevation={2} sx={{ p: 2 }}>
                    <AuditDashboard
                        logs={logs}
                    />
                </Paper>
            </Stack>
        </Container>
    );
}