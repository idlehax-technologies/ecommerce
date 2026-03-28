// app/admin/tenants/page.tsx

import Link from "next/link";
import { Container, Stack, Card, CardContent, Typography, Button, Chip } from "@mui/material";

import { listAllTenants, assumeTenantAdminUseCase } from "@/lib/tenants/service";
import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/auth/guards";

/**
 * Superadmin Control Plane — Server Page
 * Lists tenants and allows impersonation.
 */

export default async function TenantsPage() {

    const rawUser = await getUserFromRequest();
    requireRole(rawUser, "superadmin");

    const tenants = await listAllTenants();

    async function assume(formData: FormData) {
        "use server";
        const tenantId = formData.get("tenantId") as string;
        await assumeTenantAdminUseCase(tenantId);
    }

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Stack spacing={3}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">Tenants</Typography>

                    <Link href="/platform/tenants/new" style={{ textDecoration: "none" }}>
                        <Button variant="contained">
                            New Tenant
                        </Button>
                    </Link>
                </Stack>

                {tenants.map((t) => (
                    <Card key={t.tenantId}>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Stack>
                                    <Typography variant="h6">{t.name}</Typography>

                                    <Chip
                                        size="small"
                                        label={t.status}
                                        color={
                                            t.status === "ACTIVE"
                                                ? "success"
                                                : t.status === "SUSPENDED"
                                                    ? "warning"
                                                    : t.status === "ARCHIVED"
                                                        ? "default"
                                                        : "default" // PENDING
                                        }
                                        sx={{ width: "fit-content", mt: 1 }}
                                    />
                                </Stack>

                                <Stack direction="row" spacing={1}>
                                    <Link
                                        href={`/platform/tenants/${t.tenantId}`}
                                        style={{ textDecoration: "none" }}
                                    >
                                        <Button variant="outlined">
                                            Manage
                                        </Button>
                                    </Link>

                                    <form action={assume}>
                                        <input type="hidden" name="tenantId" value={t.tenantId} />
                                        <Button type="submit" variant="contained">
                                            Assume
                                        </Button>
                                    </form>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        </Container>
    );
}