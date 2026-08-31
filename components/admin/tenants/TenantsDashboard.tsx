"use client";

import { useMemo, useState } from "react";

import {
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import type { Tenant } from "@/types/tenant";

import TenantsList from "./TenantsList";

type Props = {
    tenants: Tenant[];
};

export default function TenantsDashboard({
    tenants,
}: Props) {

    const [search, setSearch] =
        useState("");

    const filtered = useMemo(() => {

        const q =
            search.toLowerCase();

        return tenants
            .filter((tenant) => (
                tenant.name
                    .toLowerCase()
                    .includes(q) ||

                tenant.status
                    .toLowerCase()
                    .includes(q) ||

                tenant.address
                    .toLowerCase()
                    .includes(q) ||

                tenant.state
                    .toLowerCase()
                    .includes(q) ||

                (
                    tenant.gstin
                        ? "gst"
                        : "non-gst"
                ) === q
            ))
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );

    }, [
        tenants,
        search,
    ]);

    return (
        <Stack spacing={2}>

            <TextField
                label="Search tenants"
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
                fullWidth
            />

            {filtered.length > 0 && (
                <TenantsList
                    tenants={filtered}
                />
            )}

            {filtered.length === 0 && (
                <Typography color="text.secondary">
                    No tenants found.
                </Typography>
            )}

        </Stack>
    );
}