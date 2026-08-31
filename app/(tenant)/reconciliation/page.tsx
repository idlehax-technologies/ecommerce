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

import ReconciliationDashboard
    from "@/components/reconciliation/ReconciliationDashboard";

import ReconciliationExportAction
    from "@/components/reconciliation/ReconciliationExportAction";

import { getReconciliation }
    from "@/lib/api/reconciliation";

import type {
    ReconciliationReport,
} from "@/types/reconciliation";

export default function ReconciliationPage() {

    const [report, setReport] = useState<ReconciliationReport | null>(null);
    const [loading, setLoading] = useState(true);

    async function load() {
        try {
            setLoading(true);
            const res = await getReconciliation();
            setReport(res.report);
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

    if (!report) {
        return null;
    }

    return (
        <Container maxWidth="md">
            <Stack spacing={3} sx={{ p: 6 }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Box>
                        <Typography variant="h5" fontWeight={600}>
                            Reconciliation
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Review and resolve data inconsistencies
                        </Typography>
                    </Box>

                    <ReconciliationExportAction />
                </Stack>

                <Divider />

                <Paper elevation={2} sx={{ p: 2 }}>
                    <ReconciliationDashboard
                        report={report}
                        reload={load}
                    />
                </Paper>
            </Stack>
        </Container>
    );
}