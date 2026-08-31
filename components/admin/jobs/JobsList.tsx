"use client";

import { Stack } from "@mui/material";

import type { Job } from "@/types/job";

import JobRow from "./JobRow";

export default function JobsList({
    jobs,
}: {
    jobs: Job[];
}) {
    return (
        <Stack spacing={2}>
            {jobs.map((job) => (
                <JobRow
                    key={job.jobId}
                    job={job}
                />
            ))}
        </Stack>
    );
}