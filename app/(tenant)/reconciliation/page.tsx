"use client";

import { useEffect, useState } from "react";

import {
    Container,
    Typography,
    Box,
    CircularProgress,
} from "@mui/material";

import ReconciliationReportView from "@/components/reconciliation/ReconciliationReportView";

import ExportButtons from "@/components/export/ExportButtons";

import { getReconciliation } from "@/lib/api/reconciliation";

import type { ReconciliationReport } from "@/types/reconciliation";

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
        <Container sx={{ mt: 6 }}>
            <Typography variant="h4" gutterBottom>
                Reconciliation
            </Typography>

            <Box mb={2}>
                <ExportButtons />
            </Box>

            <Box mt={3}>
                <ReconciliationReportView
                    report={report}
                    reload={load}
                />
            </Box>
        </Container>
    );
}