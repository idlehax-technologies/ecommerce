"use client";

import {
    Grid,
    Stack,
    Typography,
} from "@mui/material";

import MetricCard from "./MetricCard";

import { formatINR } from "@/lib/format/currency";

import type { AnalyticsSummary } from "@/types/analytics";

type Props = {
    summary: AnalyticsSummary;
};

export default function AnalyticsSummary({
    summary,
}: Props) {

    return (
        <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600}>
                Summary
            </Typography>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <MetricCard
                        title="Total Orders"
                        value={summary.totalOrders}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <MetricCard
                        title="Total Units Sold"
                        value={summary.totalUnitsSold}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <MetricCard
                        title="Gross Revenue"
                        value={formatINR(summary.grossRevenue)}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <MetricCard
                        title="Discount Given"
                        value={formatINR(summary.discountGiven)}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <MetricCard
                        title="Net Revenue"
                        value={formatINR(summary.netRevenue)}
                    />
                </Grid>
            </Grid>
        </Stack>
    );
}