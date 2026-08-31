"use client";

import { Stack } from "@mui/material";

import type { Tenant } from "@/types/tenant";

import TenantRow from "./TenantRow";

export default function TenantsList({
    tenants,
}: {
    tenants: Tenant[];
}) {
    return (
        <Stack spacing={2}>
            {tenants.map((tenant) => (
                <TenantRow
                    key={tenant.tenantId}
                    tenant={tenant}
                />
            ))}
        </Stack>
    );
}