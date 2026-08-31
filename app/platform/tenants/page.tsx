import Link from "next/link";

import {
    Container,
    Box,
    Stack,
    Typography,
    Button,
    Divider,
    Paper,
} from "@mui/material";

import { getUserFromRequest } from "@/lib/session/session";
import { requireSuperadmin } from "@/lib/auth/guards";

import { listAllTenants } from "@/lib/tenants/service";

import TenantsDashboard
    from "@/components/admin/tenants/TenantsDashboard";

export default async function TenantsPage() {

    const rawUser = await getUserFromRequest();
    requireSuperadmin(rawUser);

    const tenants = await listAllTenants();

    return (
        <Container maxWidth="md">
            <Stack spacing={3} sx={{ p: 6 }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Box>
                        <Typography variant="h5" fontWeight={600}>
                            Tenants
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            View and manage tenant organizations
                        </Typography>
                    </Box>

                    <Link href="/platform/tenants/new">
                        <Button variant="contained">
                            New Tenant
                        </Button>
                    </Link>
                </Stack>

                <Divider />

                <Paper elevation={2} sx={{ p: 2 }}>
                    <TenantsDashboard
                        tenants={tenants}
                    />
                </Paper>
            </Stack>
        </Container>
    );
}