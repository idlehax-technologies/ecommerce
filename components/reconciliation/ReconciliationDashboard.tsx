"use client";

import { useMemo, useState } from "react";

import {
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import ReconciliationList from "./ReconciliationList";

import { formatUnknownValue } from "@/lib/format/unknown";

import type { ReconciliationReport } from "@/types/reconciliation";

type Props = {
    report: ReconciliationReport;
    reload: () => Promise<void>;
};

export default function ReconciliationDashboard({
    report,
    reload,
}: Props) {

    const [search, setSearch] =
        useState("");

    const filtered = useMemo(() => {

        const q =
            search.toLowerCase();

        return [...report.mismatches]
            .filter((mismatch) => (

                mismatch.type
                    .toLowerCase()
                    .includes(q)

                ||

                (
                    mismatch.orderId &&
                    mismatch.orderId
                        .toLowerCase()
                        .includes(q)
                )

                ||

                (
                    mismatch.paymentId &&
                    mismatch.paymentId
                        .toLowerCase()
                        .includes(q)
                )

                ||

                (
                    mismatch.productId &&
                    mismatch.productId
                        .toLowerCase()
                        .includes(q)
                )

                ||

                formatUnknownValue(mismatch.expected)
                    .toLowerCase()
                    .includes(q)

                ||

                formatUnknownValue(mismatch.actual)
                    .toLowerCase()
                    .includes(q)

            ))
            .sort(
                (a, b) =>
                    new Date(b.detectedAt).getTime() -
                    new Date(a.detectedAt).getTime()
            );

    }, [
        report.mismatches,
        search,
    ]);

    return (
        <Stack spacing={2}>

            <TextField
                label="Search reconciliation"
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
                fullWidth
            />

            {filtered.length > 0 && (
                <ReconciliationList
                    mismatches={filtered}
                    reload={reload}
                />
            )}

            {filtered.length === 0 && (
                <Typography color="text.secondary">
                    No reconciliation mismatches found.
                </Typography>
            )}

        </Stack>
    );
}