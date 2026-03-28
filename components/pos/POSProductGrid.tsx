"use client";

import { Grid, Box, Typography } from "@mui/material";
import POSProductCard from "./POSProductCard";

import type { POSRow } from "@/lib/mappers/posView";

type POSRowWithAction = POSRow & {
    onSelect: () => void;
};

type Props = {
    rows: POSRowWithAction[];
};

export default function POSProductGrid({ rows }: Props) {
    if (rows.length === 0) {
        return (
            <Box textAlign="center" py={8}>
                <Typography color="text.secondary">
                    No products available.
                </Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {rows.map((row) => (
                <Grid
                    key={row.product.productId}
                    size={{ xs: 12, sm: 6, md: 4 }}
                >
                    <POSProductCard row={row} />
                </Grid>
            ))}
        </Grid>
    );
}