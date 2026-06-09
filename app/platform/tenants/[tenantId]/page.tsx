import {
    Container,
    Typography,
    Paper,
    Stack,
    Button,
} from "@mui/material";

import { getUserFromRequest } from "@/lib/auth";
import { requireSuperadmin } from "@/lib/auth/guards";

import {
    activateTenantUseCase,
    archiveTenantUseCase,
    assumeTenantAdminUseCase,
    getTenantById,
    suspendTenantUseCase
} from "@/lib/tenants/service";

import TenantForm from "@/components/admin/tenants/TenantForm";
import TenantStatusBadge from "@/components/admin/tenants/TenantStatusBadge";
import TenantLifecycleActions from "@/components/admin/tenants/TenantLifecycleActions";
import Link from "next/link";

type PageProps = {
    params: Promise<{ tenantId: string }>;
};

export default async function EditTenantPage({ params }: PageProps) {

    const rawUser = await getUserFromRequest();
    requireSuperadmin(rawUser);

    const { tenantId } = await params;

    const tenant = await getTenantById(tenantId);

    async function activate() {
        "use server";
        await activateTenantUseCase(tenantId);
    }

    async function suspend() {
        "use server";
        await suspendTenantUseCase(tenantId);
    }

    async function archive() {
        "use server";
        await archiveTenantUseCase(tenantId);
    }

    async function assume() {
        "use server";
        await assumeTenantAdminUseCase(tenantId);
    }

    return (
        <Container
            maxWidth="md"
            sx={{ py: 4 }}
        >
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography variant="h5">
                    Edit Tenant
                </Typography>

                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                >
                    <Link
                        href={`/platform/tenants/${tenantId}/inventory`}
                        style={{ textDecoration: "none" }}
                    >
                        <Button variant="outlined">
                            Inventory
                        </Button>
                    </Link>

                    <TenantStatusBadge
                        status={tenant.status}
                    />

                    <TenantLifecycleActions
                        tenant={tenant}
                        activate={activate}
                        suspend={suspend}
                        archive={archive}
                        assume={assume}
                    />
                </Stack>
            </Stack>

            <Typography
                variant="body2"
                color="text.secondary"
            >
                Created:{" "}
                {new Date(
                    tenant.createdAt
                ).toLocaleString()}
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
            >
                Updated:{" "}
                {new Date(
                    tenant.updatedAt
                ).toLocaleString()}
            </Typography>

            <Paper sx={{ p: 3 }}>
                <TenantForm
                    mode="edit"
                    tenant={tenant}
                />
            </Paper>
        </Container>
    );
}