import {
    Container,
    Box,
    Stack,
    Typography,
    Divider,
    Paper,
} from "@mui/material";

import { getUserFromRequest } from "@/lib/session/session";
import { requireSuperadmin } from "@/lib/auth/guards";

import { listJobs } from "@/lib/jobs/service";

import JobsDashboard
    from "@/components/admin/jobs/JobsDashboard";

export default async function JobsPage() {

    const rawUser = await getUserFromRequest();
    requireSuperadmin(rawUser);

    const jobs = await listJobs();

    return (
        <Container maxWidth="md">
            <Stack spacing={3} sx={{ p: 6 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Jobs
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        View background job execution history
                    </Typography>
                </Box>

                <Divider />

                <Paper elevation={2} sx={{ p: 2 }}>
                    <JobsDashboard
                        jobs={jobs}
                    />
                </Paper>
            </Stack>
        </Container>
    );
}