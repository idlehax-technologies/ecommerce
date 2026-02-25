// app/admin/tenants/[tenantId]/page.tsx

import Link from "next/link";
import { Container, Stack, Card, CardContent, Typography, Button, Chip } from "@mui/material";

import {
    getTenantById,
    activateTenantUseCase,
    deactivateTenantUseCase,
    assumeTenantAdminUseCase,
} from "@/lib/tenants/service";
import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/auth/guards";

type PageProps = {
    params: Promise<{ tenantId: string }>;
};

/**
 * Tenant Management Page (Superadmin Only)
 */

export default async function TenantDetailPage({ params }: PageProps) {
    const { tenantId } = await params;

    const rawUser = await getUserFromRequest();
    requireRole(rawUser, "superadmin");

    const tenant = await getTenantById(tenantId);

    async function activate() {
        "use server";
        await activateTenantUseCase(tenantId);
    }

    async function deactivate() {
        "use server";
        await deactivateTenantUseCase(tenantId);
    }

    async function assume() {
        "use server";
        await assumeTenantAdminUseCase(tenantId);
    }

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Card>
                <CardContent>
                    <Stack spacing={3}>
                        <Typography variant="h5">{tenant.name}</Typography>

                        <Chip
                            label={tenant.status}
                            color={
                                tenant.status === "active"
                                    ? "success"
                                    : tenant.status === "inactive"
                                        ? "error"
                                        : "default"
                            }
                            sx={{ width: "fit-content" }}
                        />

                        <Stack direction="row" spacing={2}>
                            {tenant.status !== "active" && (
                                <form action={activate}>
                                    <Button type="submit" variant="contained">
                                        Activate
                                    </Button>
                                </form>
                            )}

                            {tenant.status === "active" && (
                                <form action={deactivate}>
                                    <Button type="submit" color="error" variant="contained">
                                        Deactivate
                                    </Button>
                                </form>
                            )}

                            <form action={assume}>
                                <Button type="submit" variant="outlined">
                                    Assume as Admin
                                </Button>
                            </form>
                        </Stack>
                        <Link href={`/platform/tenants/${tenantId}/inventory`} style={{ textDecoration: "none" }}>
                            <Button variant="contained">
                                Go to inventory
                            </Button>
                        </Link>
                        <Link href="/platform/tenants" style={{ textDecoration: "none" }}>
                            <Button variant="contained">
                                Back
                            </Button>
                        </Link>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
}