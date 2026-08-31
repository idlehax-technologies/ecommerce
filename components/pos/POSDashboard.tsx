"use client";

import { useMemo, useState } from "react";

import {
    Stack,
    Paper,
    Grid,
    TextField,
    MenuItem,
    Typography,
} from "@mui/material";

import POSProductGrid from "./POSProductGrid";
import POSCart from "./POSCart";

import {
    mapToPOSRows,
    type POSRow,
    type POSRowWithAction,
} from "@/lib/mappers/posView";

import type {
    TenantProductRow,
} from "@/lib/mappers/tenantProductView";

import {
    PRODUCT_CATEGORIES,
    type ProductCategory,
} from "@/lib/products/categories";

type Props = {
    rows: TenantProductRow[];
    cart: Record<string, number>;
    hasGst: boolean;
    onAdd: (productId: string) => void;
    onUpdate: (
        productId: string,
        quantity: number
    ) => void;
    onSubmit: () => Promise<void>;
};

export default function POSDashboard({
    rows,
    cart,
    hasGst,
    onAdd,
    onUpdate,
    onSubmit,
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

                    row.product.sku
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

    const posRows: POSRow[] = mapToPOSRows(filtered, cart);

    const rowsWithActions: POSRowWithAction[] =
        posRows.map((row) => ({
            ...row,
            onSelect: () =>
                onAdd(row.product.productId),
        }));

    return (
        <Stack spacing={2}>
            <Grid
                container
                spacing={{ xs: 2, md: 3 }}
            >
                <Grid size={{ xs: 12, md: 8 }}>
                    <TextField
                        label="Search products"
                        fullWidth
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                        select
                        label="Category"
                        fullWidth
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

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    {filtered.length > 0 ? (
                        <POSProductGrid
                            rows={rowsWithActions}
                        />
                    ) : (
                        <Typography color="text.secondary">
                            No products found.
                        </Typography>
                    )}
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            position: "sticky",
                            top: 16,
                        }}
                    >
                        <POSCart
                            cart={cart}
                            rows={rows}
                            hasGst={hasGst}
                            onUpdate={onUpdate}
                            onSubmit={onSubmit}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Stack>
    );
}