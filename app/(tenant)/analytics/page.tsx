"use client";

import { useEffect, useState } from "react";

import {
    Box,
    Stack,
    Typography,
    Paper,
    Divider,
    CircularProgress,
} from "@mui/material";

import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";
import OrderStatusBreakdown from "@/components/analytics/OrderStatusBreakdown";
import DailyAnalyticsTable from "@/components/analytics/DailyAnalyticsTable";
import TopProductsTable from "@/components/analytics/TopProductsTable";
import OrdersExportAction from "@/components/analytics/OrdersExportAction";

import { getAnalytics } from "@/lib/api/analytics";
import { formatDateTime } from "@/lib/format/datetime";

import type { TenantAnalytics } from "@/types/analytics";

export default function AnalyticsPage() {

    const [analytics, setAnalytics] = useState<TenantAnalytics | null>(null);
    const [loading, setLoading] = useState(true);

    async function load() {
        try {
            setLoading(true);
            const res = await getAnalytics();
            setAnalytics(res.analytics);

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

    if (!analytics) {
        return null;
    }

    return (
        <Stack spacing={3} sx={{ p: 4 }}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Analytics
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Business performance summary and sales insights
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Generated: {formatDateTime(analytics.generatedAt)}
                    </Typography>
                </Box>

                <OrdersExportAction />
            </Stack>

            <Divider />

            <Paper elevation={2} sx={{ p: 2 }}>
                <Stack spacing={2}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                        <AnalyticsSummary
                            summary={analytics.summary}
                        />
                    </Paper>

                    <Paper elevation={2} sx={{ p: 2 }}>
                        <OrderStatusBreakdown
                            summary={analytics.summary}
                        />
                    </Paper>

                    <Paper elevation={2} sx={{ p: 2 }}>
                        <DailyAnalyticsTable
                            dailyAnalytics={analytics.dailyAnalytics}
                        />
                    </Paper>

                    <Paper elevation={2} sx={{ p: 2 }}>
                        <TopProductsTable
                            topProducts={analytics.topProducts}
                        />
                    </Paper>
                </Stack>
            </Paper>
        </Stack>
    );
}