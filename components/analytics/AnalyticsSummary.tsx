"use client";

import { Card, CardContent, Typography, Stack } from "@mui/material";
import type { AnalyticsSummary } from "@/types/analytics";

export default function AnalyticsSummaryView({
    summary,
}: {
    summary: AnalyticsSummary;
}) {
    return (
        <Stack direction="row" spacing={2}>
            <Card>
                <CardContent>
                    <Typography variant="body2">Orders</Typography>
                    <Typography variant="h6">{summary.totalOrders}</Typography>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="body2">Revenue</Typography>
                    <Typography variant="h6">
                        ₹ {(summary.totalRevenue / 100).toFixed(2)}
                    </Typography>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="body2">Units Sold</Typography>
                    <Typography variant="h6">{summary.totalUnitsSold}</Typography>
                </CardContent>
            </Card>
        </Stack>
    );
}