import { notFound } from "next/navigation";
import { Box, Typography, Paper, Divider } from "@mui/material";

import { getUserFromRequest } from "@/lib/auth";
import { requireSuperadmin } from "@/lib/auth/guards";

import { getTenantProvisioningView } from "@/lib/tenantInventory/service";
import TenantInventoryDashboard from "@/components/admin/tenantInventory/TenantInventoryDashboard";

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
                    Tenant Inventory
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Configure which products this tenant can sell
                </Typography>
            </Box>

            <Divider />

            <Paper elevation={2} sx={{ p: 2 }}>
                <TenantInventoryDashboard
                    tenantId={tenantId}
                    rows={view}
                />
            </Paper>
        </Box>
    );
}