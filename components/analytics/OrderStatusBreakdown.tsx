"use client";

import { Grid, Stack, Typography } from "@mui/material";

import MetricCard from "./MetricCard";

import type { AnalyticsSummary } from "@/types/analytics";

type Props = {
    summary: AnalyticsSummary;
};

export default function OrderStatusBreakdown({
    summary,
}: Props) {
    return (
        <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600}>
                Order Status
            </Typography>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                    <MetricCard
                        title="Reserved"
                        value={summary.reservedOrders}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                    <MetricCard
                        title="Paid"
                        value={summary.paidOrders}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                    <MetricCard
                        title="Picked Up"
                        value={summary.pickedUpOrders}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                    <MetricCard
                        title="Cancelled"
                        value={summary.cancelledOrders}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                    <MetricCard
                        title="Expired"
                        value={summary.expiredOrders}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                    <MetricCard
                        title="Refunded"
                        value={summary.refundedOrders}
                    />
                </Grid>
            </Grid>
        </Stack>
    );
}