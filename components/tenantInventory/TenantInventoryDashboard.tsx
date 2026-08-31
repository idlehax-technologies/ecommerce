"use client";

import { useMemo, useState } from "react";

import {
    Stack,
    TextField,
    ToggleButtonGroup,
    ToggleButton,
    Typography,
} from "@mui/material";

import type {
    TenantProvisioningRow,
} from "@/lib/mappers/tenantProvisioningView";

import TenantInventorySection
    from "./TenantInventorySection";

import {
    LOW_STOCK_THRESHOLD
} from "@/lib/tenantInventory/constants";

const SECTIONS = [
    "ALL",
    "LOW STOCK",
    "ADEQUATE STOCK",
    "DISABLED",
    "NOT PROVISIONED",
] as const;

type Props = {
    rows: TenantProvisioningRow[];
};

export default function TenantInventoryDashboard({ rows }: Props) {

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState<typeof SECTIONS[number]>("ALL");

    const filtered = useMemo(() => {

        const q =
            search.toLowerCase();

        return rows.filter((row) => {

            return (
                row.product.title
                    .toLowerCase()
                    .includes(q) ||

                row.product.sku
                    .toLowerCase()
                    .includes(q)
            );
        })
            .sort(
                (a, b) =>
                    a.product.title.localeCompare(
                        b.product.title
                    )
            );

    }, [
        rows,
        search,
    ]);

    const grouped = {

        "LOW STOCK":
            filtered.filter(
                (row) =>
                    row.isProvisioned &&
                    row.enabled &&
                    row.available <= LOW_STOCK_THRESHOLD
            ),

        "ADEQUATE STOCK":
            filtered.filter(
                (row) =>
                    row.isProvisioned &&
                    row.enabled &&
                    row.available > LOW_STOCK_THRESHOLD
            ),

        "DISABLED":
            filtered.filter(
                (row) =>
                    row.isProvisioned &&
                    !row.enabled
            ),

        "NOT PROVISIONED":
            filtered.filter(
                (row) =>
                    !row.isProvisioned
            ),
    };

    const visible =
        statusFilter === "ALL"
            ? grouped
            : {
                [statusFilter]:
                    grouped[
                    statusFilter as keyof typeof grouped
                    ],
            };

    return (
        <Stack spacing={2}>

            <TextField
                label="Search inventory"
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
                fullWidth
            />

            <ToggleButtonGroup
                value={statusFilter}
                exclusive
                size="small"
                onChange={(_, value) => {
                    if (value) {
                        setStatusFilter(value);
                    }
                }}
            >

                {SECTIONS.map((section) => (
                    <ToggleButton
                        key={section}
                        value={section}
                    >
                        {section}
                    </ToggleButton>
                ))}

            </ToggleButtonGroup>

            {Object.entries(visible).map(
                ([section, rows]) =>
                    rows.length ? (
                        <TenantInventorySection
                            key={section}
                            title={`${section} (${rows.length})`}
                            rows={rows}
                        />
                    ) : null
            )}

            {filtered.length === 0 && (
                <Typography color="text.secondary">
                    No inventory found.
                </Typography>
            )}

        </Stack>
    );
}