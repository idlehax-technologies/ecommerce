import Link from "next/link";

import {
    Container,
    Stack,
    Typography,
    Button,
} from "@mui/material";

import { getUserFromRequest } from "@/lib/auth";
import { requireSuperadmin } from "@/lib/auth/guards";

import { listAllTenants } from "@/lib/tenants/service";

import TenantCard from "@/components/admin/tenants/TenantCard";

export default async function TenantsPage() {
    const rawUser = await getUserFromRequest();
    requireSuperadmin(rawUser);

    const tenants = await listAllTenants();

    return (
        <Container
            maxWidth="md"
            sx={{ py: 6 }}
        >
            <Stack spacing={3}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography variant="h4">
                        Tenants
                    </Typography>

                    <Link
                        href="/platform/tenants/new"
                        style={{ textDecoration: "none" }}
                    >
                        <Button variant="contained">
                            New Tenant
                        </Button>
                    </Link>
                </Stack>

                {tenants.map((tenant) => (
                    <TenantCard
                        key={tenant.tenantId}
                        tenant={tenant}
                    />
                ))}
            </Stack>
        </Container>
    );
}