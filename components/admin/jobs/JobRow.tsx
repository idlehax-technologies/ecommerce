"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    Paper,
    Stack,
    Typography,
    Button,
    Divider,
} from "@mui/material";

import JobStatusBadge from "./JobStatusBadge";

import { retryJobApi } from "@/lib/api/jobs";
import { formatDateTime } from "@/lib/format/datetime";
import { useSnackbar } from "@/contexts/SnackbarContext";

import type { Job } from "@/types/job";

export default function JobRow({
    job,
}: {
    job: Job;
}) {
    const router = useRouter();
    const { show } = useSnackbar();
    const [loading, setLoading] = useState(false);

    async function retry() {
        try {
            setLoading(true);
            await retryJobApi(job.jobId);
            show("Job retried");
            router.refresh();

        } catch (err: unknown) {
            if (err instanceof Error) {
                show(err.message, "error");
            } else {
                show("Failed to retry job", "error");
            }

        } finally {
            setLoading(false);
        }
    }

    return (
        <Paper
            elevation={2}
            sx={{ p: 2 }}
        >
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Stack spacing={0.25}>
                    <Typography fontWeight={600}>
                        {job.type}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Attempts: {job.attempts}
                    </Typography>
                </Stack>

                <Stack
                    spacing={0.5}
                    alignItems="flex-end"
                >
                    <Typography variant="body2">
                        {formatDateTime(job.runAt)}
                    </Typography>

                    <JobStatusBadge
                        status={job.status}
                    />
                </Stack>
            </Stack>

            {job.status === "FAILED" && (
                <>
                    <Divider sx={{ my: 1.5 }} />

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography
                            variant="body2"
                            color="error"
                            sx={{ wordBreak: "break-word" }}
                        >
                            {job.lastError}
                        </Typography>

                        <Button
                            size="small"
                            variant="outlined"
                            onClick={retry}
                            disabled={loading}
                        >
                            Retry
                        </Button>
                    </Stack>
                </>
            )}
        </Paper>
    );
}