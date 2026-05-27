"use client";

import { Container, Typography, Stack, Divider, CircularProgress } from "@mui/material";

import { getAnalytics } from "@/lib/api/analytics";

import AnalyticsSummaryView from "@/components/analytics/AnalyticsSummary";
import ProductTable from "@/components/analytics/ProductTable";
import { useEffect, useState } from "react";
import { TenantAnalytics } from "@/types/analytics";

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
        <Container sx={{ mt: 6 }}>

            <Typography variant="h4" gutterBottom>
                Analytics
            </Typography>

            <Stack spacing={4}>

                <AnalyticsSummaryView summary={analytics.summary} />

                <Divider />

                <div>

                    <Typography variant="h6" gutterBottom>
                        Top Products
                    </Typography>

                    <ProductTable products={analytics.topProducts} />

                </div>

            </Stack>

        </Container>
    );
}