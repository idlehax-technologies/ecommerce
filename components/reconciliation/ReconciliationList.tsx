"use client";

import { Stack } from "@mui/material";

import ReconciliationRow from "./ReconciliationRow";

import type { ReconciliationMismatch } from "@/types/reconciliation";

type Props = {
    mismatches: ReconciliationMismatch[];
    reload: () => Promise<void>;
};

export default function ReconciliationList({
    mismatches,
    reload,
}: Props) {

    return (
        <Stack spacing={2}>
            {mismatches.map((mismatch) => (
                <ReconciliationRow
                    key={[
                        mismatch.type,
                        mismatch.orderId,
                        mismatch.paymentId,
                        mismatch.productId,
                        mismatch.detectedAt,
                    ].join(":")}
                    mismatch={mismatch}
                    reload={reload}
                />
            ))}
        </Stack>
    );
}