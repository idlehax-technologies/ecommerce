"use client";

import { useMemo, useState } from "react";

import {
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import type { Job } from "@/types/job";

import JobsList from "./JobsList";

type Props = {
    jobs: Job[];
};

export default function JobsDashboard({
    jobs,
}: Props) {

    const [search, setSearch] =
        useState("");

    const filtered = useMemo(() => {

        const q =
            search.toLowerCase();

        return jobs
            .filter((job) => (
                job.type
                    .toLowerCase()
                    .includes(q) ||

                job.status
                    .toLowerCase()
                    .includes(q) ||

                String(job.attempts)
                    .includes(q) ||

                (
                    job.lastError &&
                    job.lastError
                        .toLowerCase()
                        .includes(q)
                )
            ))
            .sort(
                (a, b) =>
                    new Date(b.runAt).getTime() -
                    new Date(a.runAt).getTime()
            );

    }, [
        jobs,
        search,
    ]);

    return (
        <Stack spacing={2}>

            <TextField
                label="Search jobs"
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
                fullWidth
            />

            {filtered.length > 0 && (
                <JobsList jobs={filtered} />
            )}

            {filtered.length === 0 && (
                <Typography color="text.secondary">
                    No jobs found.
                </Typography>
            )}

        </Stack>
    );
}