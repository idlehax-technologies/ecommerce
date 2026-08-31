"use client";

import { useEffect, useState } from "react";

import {
    Box,
    Stack,
    Typography,
    Paper,
    Divider,
    CircularProgress,
} from "@mui/material";

import TenantInventoryDashboard from "@/components/tenantInventory/TenantInventoryDashboard";

import { getTenantInventoryView } from "@/lib/api/tenantInventory";

import { TenantProvisioningRow } from "@/lib/mappers/tenantProvisioningView";

export default function TenantInventoryPage() {

    const [rows, setRows] = useState<TenantProvisioningRow[]>([]);
    const [loading, setLoading] = useState(true);

    async function load() {
        try {
            setLoading(true);
            const res = await getTenantInventoryView();
            setRows(res.rows);

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Stack spacing={3} sx={{ p: 4 }}>
            <Box>
                <Typography variant="h5" fontWeight={600}>
                    Inventory
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Products available for sale in this tenant
                </Typography>
            </Box>

            <Divider />

            <Paper elevation={2} sx={{ p: 2 }}>
                <TenantInventoryDashboard
                    rows={rows}
                />
            </Paper>
        </Stack>
    );
}