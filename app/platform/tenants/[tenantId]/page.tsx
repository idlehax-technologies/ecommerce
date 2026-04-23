// app/platform/tenants/[tenantId]/page.tsx

import Link from "next/link";
import { Container, Stack, Card, CardContent, Typography, Button, Chip } from "@mui/material";

import {
    getTenantById,
    activateTenantUseCase,
    suspendTenantUseCase,
    archiveTenantUseCase,
    assumeTenantAdminUseCase,
} from "@/lib/tenants/service";
import { getUserFromRequest } from "@/lib/auth";
import { requireSuperadmin } from "@/lib/auth/guards";

type PageProps = {
    params: Promise<{ tenantId: string }>;
};

/**
 * Tenant Management Page (Superadmin Only)
 */

export default async function TenantDetailPage({ params }: PageProps) {
    const { tenantId } = await params;

    const rawUser = await getUserFromRequest();

    requireSuperadmin(rawUser);

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
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Card>
                <CardContent>
                    <Stack spacing={3}>

                        {/* Header + Action */}
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Typography variant="h5">
                                {tenant.name}
                            </Typography>

                            <Link
                                href={`/platform/tenants/${tenantId}/inventory/low-stock`}
                                style={{ textDecoration: "none" }}
                            >
                                <Button>
                                    Low Stock
                                </Button>
                            </Link>
                        </Stack>

                        <Chip
                            label={tenant.status}
                            color={
                                tenant.status === "ACTIVE"
                                    ? "success"
                                    : tenant.status === "SUSPENDED"
                                        ? "warning"
                                        : tenant.status === "ARCHIVED"
                                            ? "default"
                                            : "default"
                            }
                            sx={{ width: "fit-content" }}
                        />

                        <Stack direction="row" spacing={2}>
                            {/* Activate: allowed from PENDING & SUSPENDED */}
                            {(tenant.status === "PENDING" || tenant.status === "SUSPENDED") && (
                                <form action={activate}>
                                    <Button type="submit" variant="contained">
                                        Activate
                                    </Button>
                                </form>
                            )}

                            {/* Suspend: only from ACTIVE */}
                            {tenant.status === "ACTIVE" && (
                                <form action={suspend}>
                                    <Button type="submit" color="warning" variant="contained">
                                        Suspend
                                    </Button>
                                </form>
                            )}

                            {/* Archive: allowed from anything except ARCHIVED */}
                            {tenant.status !== "ARCHIVED" && (
                                <form action={archive}>
                                    <Button type="submit" color="error" variant="outlined">
                                        Archive
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