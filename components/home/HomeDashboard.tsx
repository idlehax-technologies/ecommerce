"use client";

import { useMemo, useState } from "react";

import {
    Stack,
    Grid,
    TextField,
    MenuItem,
    Typography,
} from "@mui/material";

import HomeProductGrid from "./HomeProductGrid";

import type {
    TenantProductRow,
} from "@/lib/mappers/tenantProductView";

import {
    PRODUCT_CATEGORIES,
    type ProductCategory,
} from "@/lib/products/categories";

type Props = {
    rows: TenantProductRow[];
};

export default function HomeDashboard({
    rows,
}: Props) {

    const [search, setSearch] =
        useState("");

    const [category, setCategory] =
        useState<ProductCategory | "ALL">("ALL");

    const filtered = useMemo(() => {

        const q =
            search.toLowerCase();

        return rows
            .filter((row) => {
                if (
                    category !== "ALL" &&
                    row.product.category !== category
                ) {
                    return false;
                }

                return (
                    row.product.title
                        .toLowerCase()
                        .includes(q) ||

                    row.product.description
                        .toLowerCase()
                        .includes(q) ||

                    row.product.tags.some((tag) =>
                        tag.toLowerCase().includes(q)
                    )
                );
            })
            .sort((a, b) => {
                const aOutOfStock = a.available <= 0;
                const bOutOfStock = b.available <= 0;

                if (aOutOfStock !== bOutOfStock) {
                    return aOutOfStock ? 1 : -1;
                }

                return a.product.title.localeCompare(
                    b.product.title
                );
            });

    }, [
        rows,
        search,
        category,
    ]);

    return (
        <Stack>
            <Grid
                container
                spacing={{ xs: 1, sm: 2 }}
                sx={{
                    position: "sticky",
                    top: { xs: 56, sm: 64 },
                    zIndex: (theme) =>
                        theme.zIndex.appBar - 1,
                    py: { xs: 1, sm: 2 },
                    bgcolor: "background.default",
                }}
            >
                <Grid size={{ xs: 8 }}>
                    <TextField
                        fullWidth
                        label="Search products"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
                </Grid>

                <Grid size={{ xs: 4 }}>
                    <TextField
                        select
                        fullWidth
                        label="Category"
                        value={category}
                        onChange={(e) =>
                            setCategory(
                                e.target.value as
                                ProductCategory | "ALL"
                            )
                        }
                    >
                        <MenuItem value="ALL">
                            All Categories
                        </MenuItem>

                        {PRODUCT_CATEGORIES.map(
                            (category) => (
                                <MenuItem
                                    key={category.code}
                                    value={category.name}
                                >
                                    {category.name}
                                </MenuItem>
                            )
                        )}
                    </TextField>
                </Grid>
            </Grid>

            {filtered.length > 0 ? (
                <HomeProductGrid
                    rows={filtered}
                />
            ) : (
                <Typography variant="h6" color="text.secondary">
                    No products found
                </Typography>
            )}
        </Stack>
    );
}