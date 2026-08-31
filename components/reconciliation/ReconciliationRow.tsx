"use client";

import {
    Divider,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import { formatDateTime } from "@/lib/format/datetime";
import { formatUnknownValue } from "@/lib/format/unknown";
import { getResolutionPolicy } from "@/lib/reconciliation/policy";

import ReconciliationActionButtons from "./ReconciliationActionButtons";

import type { ReconciliationMismatch } from "@/types/reconciliation";

type Props = {
    mismatch: ReconciliationMismatch;
    reload: () => Promise<void>;
};

export default function ReconciliationRow({
    mismatch,
    reload,
}: Props) {

    const policy = getResolutionPolicy(mismatch.type);

    return (
        <Paper
            elevation={2}
            sx={{ p: 2 }}
        >
            <Stack spacing={1.5}>
                <Stack spacing={1}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography fontWeight={600}>
                            {mismatch.type}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {formatDateTime(mismatch.detectedAt)}
                        </Typography>
                    </Stack>

                    <Stack>
                        {mismatch.orderId && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Order ID: {mismatch.orderId}
                            </Typography>
                        )}

                        {mismatch.paymentId && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Payment ID: {mismatch.paymentId}
                            </Typography>
                        )}

                        {mismatch.productId && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Product ID: {mismatch.productId}
                            </Typography>
                        )}
                    </Stack>

                    <Stack>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Expected: {formatUnknownValue(mismatch.expected)}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Actual: {formatUnknownValue(mismatch.actual)}
                        </Typography>
                    </Stack>
                </Stack>

                {policy.allowedActions.length > 0 && (
                    <>
                        <Divider />

                        <ReconciliationActionButtons
                            mismatch={mismatch}
                            reload={reload}
                        />
                    </>
                )}
            </Stack>
        </Paper>
    );
}