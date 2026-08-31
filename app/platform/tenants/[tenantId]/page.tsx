import Link from "next/link";
import { revalidatePath } from "next/cache";

import {
    Container,
    Box,
    Stack,
    Typography,
    Divider,
    Paper,
    Button,
} from "@mui/material";

import { getUserFromRequest } from "@/lib/session/session";
import { requireSuperadmin } from "@/lib/auth/guards";
import { formatDateTime } from "@/lib/format/datetime";

import {
    activateTenantUseCase,
    archiveTenantUseCase,
    getTenantById,
    suspendTenantUseCase,
} from "@/lib/tenants/service";

import TenantDetail from "@/components/admin/tenants/TenantDetail";

type PageProps = {
    params: Promise<{ tenantId: string }>;
};

export default async function TenantDetailPage({
    params,
}: PageProps) {

    const rawUser = await getUserFromRequest();
    requireSuperadmin(rawUser);

    const { tenantId } = await params;

    const tenant = await getTenantById(tenantId);

    async function activate() {
        "use server";
        await activateTenantUseCase(tenantId);
        revalidatePath(`/platform/tenants/${tenantId}`);
    }

    async function suspend() {
        "use server";
        await suspendTenantUseCase(tenantId);
        revalidatePath(`/platform/tenants/${tenantId}`);
    }

    async function archive() {
        "use server";
        await archiveTenantUseCase(tenantId);
        revalidatePath(`/platform/tenants/${tenantId}`);
    }

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
                            Tenant Details
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Created: {formatDateTime(tenant.createdAt)}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Updated: {formatDateTime(tenant.updatedAt)}
                        </Typography>
                    </Box>

                    <Link href={`/platform/tenants/${tenantId}/inventory`}>
                        <Button variant="contained">
                            Inventory
                        </Button>
                    </Link>
                </Stack>

                <Divider />

                <Paper elevation={2} sx={{ p: 2 }}>
                    <TenantDetail
                        tenant={tenant}
                        activate={activate}
                        suspend={suspend}
                        archive={archive}
                    />
                </Paper>
            </Stack>
        </Container>
    );
}