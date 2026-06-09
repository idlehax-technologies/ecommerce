import { notFound } from "next/navigation";
import { Box, Typography, Paper, Divider } from "@mui/material";

import TenantInventoryDashboard from "@/components/tenantInventory/TenantInventoryDashboard";

import { getUserFromRequest } from "@/lib/auth";
import { requireTenant } from "@/lib/auth/guards";

import { getTenantProvisioningView } from "@/lib/tenantInventory/service";

export default async function TenantInventoryPage() {
    const rawUser = await getUserFromRequest();

    const actor = requireTenant(rawUser);

    const view = await getTenantProvisioningView(actor.tenantId);

    if (!view) return notFound();

    return (
        <Box p={4} display="flex" flexDirection="column" gap={3}>
            <Box>
                <Typography variant="h5" fontWeight={600}>
                    Inventory
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Products available for sale in this tenant.
                </Typography>
            </Box>

            <Divider />

            <Paper elevation={2}>
                <TenantInventoryDashboard
                    tenantId={actor.tenantId}
                    rows={view}
                />
            </Paper>
        </Box>
    );
}