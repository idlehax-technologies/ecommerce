// app/platform/tenants/[tenantId]/inventory/page.tsx

import { notFound } from "next/navigation";
import { Box, Typography, Paper, Divider } from "@mui/material";

import TenantInventoryTable from "@/components/tenant-provisioning/TenantInventoryTable";

import { getUserFromRequest } from "@/lib/auth";
import { requireAnyRole, requireTenant } from "@/lib/auth/guards";
import { assertTenantScope } from "@/lib/tenants/guards";

import { getTenantProvisioningView } from "@/lib/tenantInventory/service";

type PageProps = {
    params: Promise<{ tenantId: string }>;
};

/**
 * PLATFORM CONTROL PLANE VIEW
 *
 * Superadmin → configure provisioning
 * Admin → inspect their own tenant only
 */

export default async function TenantInventoryPage({ params }: PageProps) {
    const { tenantId } = await params;

    const rawUser = await getUserFromRequest();
    const user = requireAnyRole(rawUser, ["admin", "superadmin"]);

    if (user.role === "admin") {
        const actor = requireTenant(user);
        assertTenantScope(actor, tenantId);
    }

    const canEdit = user.role === "superadmin";

    const view = await getTenantProvisioningView(tenantId);

    if (!view) return notFound();

    return (
        <Box p={4} display="flex" flexDirection="column" gap={3}>
            <Box>
                <Typography variant="h5" fontWeight={600}>
                    Tenant Product Provisioning — {tenantId}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    {canEdit
                        ? "Configure which platform products this tenant can sell."
                        : "Viewing tenant provisioning (read-only)."}
                </Typography>
            </Box>

            <Divider />

            <Paper elevation={2}>
                <TenantInventoryTable
                    tenantId={tenantId}
                    rows={view.rows}
                    canEdit={canEdit}
                />
            </Paper>
        </Box>
    );
}