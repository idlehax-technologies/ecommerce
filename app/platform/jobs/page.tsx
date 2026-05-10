import { Container, Typography, Paper } from "@mui/material";

import { getUserFromRequest } from "@/lib/auth";
import { requireSuperadmin } from "@/lib/auth/guards";

import { listJobs } from "@/lib/jobs/service";

import JobsTable from "@/components/admin/jobs/JobsTable";

export default async function JobsPage() {
    const rawUser = await getUserFromRequest();
    requireSuperadmin(rawUser);

    const jobs = listJobs();

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h5" mb={3}>
                Jobs
            </Typography>

            <Paper>
                <JobsTable jobs={jobs} />
            </Paper>
        </Container>
    );
}