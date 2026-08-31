import { Box, Stack, Typography, Paper, Divider } from "@mui/material";

import { getUserFromRequest } from "@/lib/session/session";
import { requireSuperadmin } from "@/lib/auth/guards";

import { getTenantInventoryView } from "@/lib/tenantInventory/service";
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

    const rawUser = await getUserFromRequest();
    requireSuperadmin(rawUser);

    const { tenantId } = await params;

    const view = await getTenantInventoryView(tenantId);

    return (
        <Stack spacing={3} sx={{ p: 4 }}>
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
        </Stack>
    );
}