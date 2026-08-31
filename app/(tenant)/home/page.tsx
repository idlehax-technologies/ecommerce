"use client";

import { useEffect, useState } from "react";

import {
    Stack,
    Typography,
    CircularProgress,
} from "@mui/material";

import HomeDashboard from "@/components/home/HomeDashboard";

import { getTenantProductView } from "@/lib/api/tenantInventory";
import { getTenant } from "@/lib/api/tenants";

import type {
    TenantProductRow,
} from "@/lib/mappers/tenantProductView";
import type { Tenant } from "@/types/tenant";

export default function HomePage() {

    const [rows, setRows] = useState<TenantProductRow[]>([]);
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [loading, setLoading] = useState(true);

    async function load() {
        try {
            setLoading(true);

            const [productRes, tenantRes] = await Promise.all([
                getTenantProductView(),
                getTenant(),
            ]);

            setRows(productRes.rows);
            setTenant(tenantRes.tenant);

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

    if (!tenant) {
        return null;
    }

    return (
        <Stack
            sx={{
                px: {
                    xs: 2,
                    sm: 4,
                    md: 8,
                    lg: 16,
                },
                py: {
                    xs: 1,
                    sm: 2,
                },
            }}
        >
            <Typography
                variant="h5"
                fontWeight={600}
                textAlign="center"
                sx={{
                    fontSize: {
                        xs: "1.25rem", // h6 (20px)
                        sm: "1.5rem",  // h5 (24px)
                    },
                }}
            >
                {tenant.name}
            </Typography>

            <HomeDashboard
                rows={rows}
            />
        </Stack>
    );
}