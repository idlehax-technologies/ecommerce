"use client";

import {
    Stack,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";

import { formatINR } from "@/lib/format/currency";

import type { DailyAnalytics } from "@/types/analytics";

type Props = {
    dailyAnalytics: DailyAnalytics[];
};

export default function DailyAnalyticsTable({
    dailyAnalytics,
}: Props) {

    return (
        <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600}>
                Daily Analytics
            </Typography>

            <TableContainer>
                <Table
                    sx={{
                        tableLayout: "fixed",
                        width: "100%",
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Orders</TableCell>
                            <TableCell align="center">Units Sold</TableCell>
                            <TableCell align="right">Gross Revenue</TableCell>
                            <TableCell align="right">Discount Given</TableCell>
                            <TableCell align="right">Net Revenue</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {dailyAnalytics.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No revenue data available.
                                </TableCell>
                            </TableRow>
                        ) : (
                            dailyAnalytics.map(
                                (day) => (
                                    <TableRow key={day.date}>
                                        <TableCell>
                                            {day.date}
                                        </TableCell>

                                        <TableCell>
                                            {day.orders}
                                        </TableCell>

                                        <TableCell align="center">
                                            {day.unitsSold}
                                        </TableCell>

                                        <TableCell align="right">
                                            {formatINR(day.grossRevenue)}
                                        </TableCell>

                                        <TableCell align="right">
                                            {formatINR(day.discountGiven)}
                                        </TableCell>

                                        <TableCell align="right">
                                            {formatINR(day.netRevenue)}
                                        </TableCell>
                                    </TableRow>
                                )
                            )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
}