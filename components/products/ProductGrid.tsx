"use client";

import { Grid, Box, Typography } from "@mui/material";
import type { TenantProvisioningRow } from "@/lib/mappers/tenantProvisioningView";
import ProductCard from "./ProductCard";

type Props = {
    rows: TenantProvisioningRow[];
};

export default function ProductGrid({ rows }: Props) {
    if (rows.length === 0) {
        return (
            <Box textAlign="center" py={8}>
                <Typography variant="h6" color="text.secondary">
                    No products available for this tenant.
                </Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={4}>
            {rows.map((row) => (
                <Grid key={row.product.productId} size={{ xs: 12, sm: 6, md: 4 }}>
                    <ProductCard row={row} />
                </Grid>
            ))}
        </Grid>
    );
}