"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
    TableRow,
    TableCell,
    Button,
    Stack,
} from "@mui/material";

import type { Job } from "@/types/job";

import { retryJobApi } from "@/lib/api/jobs";

import { useSnackbar } from "@/contexts/SnackbarContext";

export default function JobRow({ job }: { job: Job }) {

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
        <TableRow hover>
            <TableCell>{job.type}</TableCell>
            <TableCell>{job.status}</TableCell>
            <TableCell>{job.attempts}</TableCell>

            <TableCell>
                {new Date(job.runAt).toLocaleString()}
            </TableCell>

            <TableCell align="right">
                <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="flex-end"
                >
                    {job.status === "FAILED" && (
                        <Button
                            size="small"
                            onClick={retry}
                            disabled={loading}
                        >
                            Retry
                        </Button>
                    )}
                </Stack>
            </TableCell>
        </TableRow>
    );
}