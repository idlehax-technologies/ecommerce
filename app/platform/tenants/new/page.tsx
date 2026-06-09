import {
    Container,
    Paper,
    Typography,
} from "@mui/material";

import { getUserFromRequest } from "@/lib/auth";
import { requireSuperadmin } from "@/lib/auth/guards";

import TenantForm from "@/components/admin/tenants/TenantForm";

export default async function NewTenantPage() {

    const rawUser = await getUserFromRequest();
    requireSuperadmin(rawUser);

    return (
        <Container
            maxWidth="sm"
            sx={{ py: 4 }}
        >
            <Typography
                variant="h5"
                mb={3}
            >
                Create Tenant
            </Typography>

            <Paper sx={{ p: 3 }}>
                <TenantForm
                    mode="create"
                />
            </Paper>
        </Container>
    );
}