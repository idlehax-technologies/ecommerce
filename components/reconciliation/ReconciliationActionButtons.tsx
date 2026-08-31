"use client";

import { useTransition } from "react";

import { Button, Stack } from "@mui/material";

import { resolveReconciliation } from "@/lib/api/reconciliation";
import { getResolutionPolicy } from "@/lib/reconciliation/policy";

import type { ReconciliationMismatch } from "@/types/reconciliation";
import type { ResolutionActionType } from "@/types/reconciliationResolution";

type Props = {
    mismatch: ReconciliationMismatch;
    reload: () => Promise<void>;
};

export default function ReconciliationActionButtons({
    mismatch,
    reload,
}: Props) {

    const [pending, startTransition] = useTransition();

    const policy = getResolutionPolicy(mismatch.type);

    function generateIdempotencyKey(): string {
        return crypto.randomUUID();
    }

    function executeAction(
        action: ResolutionActionType
    ) {
        startTransition(async () => {

            await resolveReconciliation({
                idempotencyKey: generateIdempotencyKey(),

                mismatchType: mismatch.type,

                action,

                orderId: mismatch.orderId,
                paymentId: mismatch.paymentId,
                productId: mismatch.productId,
            });

            await reload();
        });
    }

    if (
        policy.allowedActions.length === 0
    ) {
        return null;
    }

    return (
        <Stack
            direction="row"
            spacing={1.5}
        >
            {policy.allowedActions.map(
                (action) => (
                    <Button
                        key={action}
                        variant={
                            action ===
                                policy.recommendedAction
                                ? "contained"
                                : "outlined"
                        }
                        size="small"
                        disabled={pending}
                        onClick={() => executeAction(action)}
                    >
                        {action}
                    </Button>
                )
            )}
        </Stack>
    );
}