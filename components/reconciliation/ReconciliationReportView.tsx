"use client";

import { Stack, Typography } from "@mui/material";

import type { ReconciliationReport } from "@/types/reconciliation";

import ReconciliationRow from "./ReconciliationRow";

export default function ReconciliationReportView({
    report,
    reload,
}: {
    report: ReconciliationReport;
    reload: () => Promise<void>;
}) {

    if (report.mismatches.length === 0) {
        return (
            <Typography color="text.secondary">
                No mismatches detected.
            </Typography>
        );
    }

    return (
        <Stack spacing={2}>
            {report.mismatches.map((m, i) => (
                <ReconciliationRow
                    key={[
                        m.type,
                        m.orderId,
                        m.paymentId,
                        m.productId,
                        i,
                    ].join(":")}
                    mismatch={m}
                    reload={reload}
                />
            ))}
        </Stack>
    );
}