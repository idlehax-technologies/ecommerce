"use client";

import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Typography,
    Box,
} from "@mui/material";

import type { Job } from "@/types/job";
import JobRow from "./JobRow";

export default function JobsTable({ jobs }: { jobs: Job[] }) {
    if (jobs.length === 0) {
        return (
            <Box textAlign="center" py={6}>
                <Typography color="text.secondary">
                    No jobs.
                </Typography>
            </Box>
        );
    }

    return (
        <Paper>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Attempts</TableCell>
                        <TableCell>Run At</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {jobs.map((job) => (
                        <JobRow key={job.jobId} job={job} />
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}