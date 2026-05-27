"use client";

import { Paper, Stack, Typography, Chip, Button } from "@mui/material";
import { useTransition } from "react";

import type { ReconciliationMismatch } from "@/types/reconciliation";
import { resolveReconciliation } from "@/lib/api/reconciliation";
import { getResolutionPolicy } from "@/lib/reconciliation/policy";
import { ResolutionActionType } from "@/types/reconciliationResolution";

export default function ReconciliationRow({
    mismatch,
    reload,
}: {
    mismatch: ReconciliationMismatch;
    reload: () => Promise<void>;
}) {

    const [pending, start] = useTransition();

    const policy = getResolutionPolicy(mismatch.type);

    function generateKey() {
        return crypto.randomUUID();
    }

    function resolve(action: ResolutionActionType) {
        start(async () => {
            await resolveReconciliation({
                idempotencyKey: generateKey(), // ✅ NEW
                mismatchType: mismatch.type,
                action,
                orderId: mismatch.orderId,
                paymentId: mismatch.paymentId,
                productId: mismatch.productId,
            });

            await reload();
        });
    }

    return (
        <Paper sx={{ p: 2 }}>
            <Stack spacing={1}>

                <Chip
                    label={mismatch.type}
                    color="warning"
                    size="small"
                    sx={{ width: "fit-content" }}
                />

                {mismatch.orderId && (
                    <Typography variant="body2">
                        Order: {mismatch.orderId}
                    </Typography>
                )}

                {mismatch.paymentId && (
                    <Typography variant="body2">
                        Payment: {mismatch.paymentId}
                    </Typography>
                )}

                {mismatch.productId && (
                    <Typography variant="body2">
                        Product: {mismatch.productId}
                    </Typography>
                )}

                <Typography variant="body2">
                    Expected: {JSON.stringify(mismatch.expected)}
                </Typography>

                <Typography variant="body2">
                    Actual: {JSON.stringify(mismatch.actual)}
                </Typography>

                {/* POLICY-DRIVEN ACTIONS */}
                {policy.allowedActions.map((action) => (
                    <Button
                        key={action}
                        onClick={() => resolve(action)}
                        disabled={pending}
                    >
                        {action}
                    </Button>
                ))}

            </Stack>
        </Paper>
    );
}