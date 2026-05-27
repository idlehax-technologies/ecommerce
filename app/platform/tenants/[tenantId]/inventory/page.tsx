// app/platform/tenants/[tenantId]/inventory/page.tsx

import { notFound } from "next/navigation";
import { Box, Typography, Paper, Divider } from "@mui/material";

import TenantInventoryTable from "@/components/tenant-provisioning/TenantInventoryTable";

import { getUserFromRequest } from "@/lib/auth";
import { requireSuperadmin } from "@/lib/auth/guards";

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

    requireSuperadmin(rawUser);

    const view = await getTenantProvisioningView(tenantId);

    if (!view) return notFound();

    return (
        <Box p={4} display="flex" flexDirection="column" gap={3}>
            <Box>
                <Typography variant="h5" fontWeight={600}>
                    Tenant Product Provisioning — {tenantId}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Configure which platform products this tenant can sell.
                </Typography>
            </Box>

            <Divider />

            <Paper elevation={2}>
                <TenantInventoryTable
                    tenantId={tenantId}
                    rows={view}
                    canEdit={true}
                />
            </Paper>
        </Box>
    );
}