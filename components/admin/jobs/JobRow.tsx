"use client";

import { TableRow, TableCell, Button, Stack } from "@mui/material";
import { useState } from "react";

import type { Job } from "@/types/job";
import { retryJobApi } from "@/lib/api/jobs";

export default function JobRow({ job }: { job: Job }) {
    const [loading, setLoading] = useState(false);

    async function retry() {
        try {
            setLoading(true);
            await retryJobApi(job.jobId);
            window.location.reload();
        } finally {
            setLoading(false);
        }
    }

    return (
        <TableRow hover>
            <TableCell>{job.type}</TableCell>
            <TableCell>{job.status}</TableCell>
            <TableCell>{job.attempts}</TableCell>
            <TableCell>{new Date(job.runAt).toLocaleString()}</TableCell>

            <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
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