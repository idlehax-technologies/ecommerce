import { Box, Typography, Paper, Divider } from "@mui/material";

import { getUserFromRequest } from "@/lib/auth";
import { requireSuperadmin } from "@/lib/auth/guards";

import { detectLowStock } from "@/lib/tenantInventory/lowStock";

import LowStockTable from "@/components/lowStock/LowStockTable";

type Props = {
    params: Promise<{ tenantId: string }>;
};

export default async function LowStockPage({ params }: Props) {

    const { tenantId } = await params;

    const rawUser = await getUserFromRequest();

    requireSuperadmin(rawUser);

    const report = await detectLowStock(tenantId);

    return (
        <Box p={4} display="flex" flexDirection="column" gap={3}>

            <Box>
                <Typography variant="h5" fontWeight={600}>
                    Low Stock Alerts — {tenantId}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Platform-managed stock allocation warnings.
                </Typography>
            </Box>

            <Divider />

            <Paper>
                <LowStockTable
                    tenantId={tenantId}
                    items={report.items}
                />
            </Paper>

        </Box>
    );
}