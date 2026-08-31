"use client";

import { useMemo, useState } from "react";

import {
    Stack,
    TextField,
    ToggleButtonGroup,
    ToggleButton,
    Typography,
} from "@mui/material";

import ProductSection
    from "./ProductSection";

import type { Product }
    from "@/types/product";

const SECTIONS = [
    "ALL",
    "ACTIVE",
    "INACTIVE",
] as const;

type Props = {
    products: Product[];
};

export default function ProductsDashboard({
    products,
}: Props) {

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState<typeof SECTIONS[number]>("ALL");

    const filtered = useMemo(() => {

        const q =
            search.toLowerCase();

        return products
            .filter((product) => {
                if (
                    statusFilter !== "ALL" &&
                    product.status !== statusFilter
                ) {
                    return false;
                }

                return (
                    product.title
                        .toLowerCase()
                        .includes(q) ||

                    product.description
                        .toLowerCase()
                        .includes(q) ||

                    product.sku
                        .toLowerCase()
                        .includes(q) ||

                    product.hsnCode
                        .toLowerCase()
                        .includes(q) ||

                    product.category
                        .toLowerCase()
                        .includes(q) ||

                    product.tags.some((tag) =>
                        tag.toLowerCase().includes(q)
                    )
                );
            })
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );
    }, [
        products,
        search,
        statusFilter,
    ]);

    const grouped = {
        ACTIVE:
            filtered.filter(
                (p) => p.status === "ACTIVE"
            ),

        INACTIVE:
            filtered.filter(
                (p) => p.status === "INACTIVE"
            ),
    };

    return (
        <Stack spacing={2}>

            <TextField
                label="Search products"
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
                onChange={(_, val) => {
                    if (val) {
                        setStatusFilter(val);
                    }
                }}
            >
                {SECTIONS.map((status) => (
                    <ToggleButton
                        key={status}
                        value={status}
                    >
                        {status}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>

            {Object.entries(grouped).map(
                ([status, list]) =>
                    list.length ? (
                        <ProductSection
                            key={status}
                            title={`${status} (${list.length})`}
                            data={list}
                        />
                    ) : null
            )}

            {filtered.length === 0 && (
                <Typography color="text.secondary">
                    No products found.
                </Typography>
            )}

        </Stack>
    );
}