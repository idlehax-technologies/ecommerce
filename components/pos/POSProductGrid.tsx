"use client";

import { Grid } from "@mui/material";

import POSProductCard from "./POSProductCard";

import type {
    POSRowWithAction,
} from "@/lib/mappers/posView";

type Props = {
    rows: POSRowWithAction[];
};

export default function POSProductGrid({
    rows,
}: Props) {

    return (
        <Grid container spacing={2}>
            {rows.map((row) => (
                <Grid
                    key={row.product.productId}
                    size={{ xs: 12, sm: 6, lg: 4 }}
                >
                    <POSProductCard row={row} />
                </Grid>
            ))}
        </Grid>
    );
}