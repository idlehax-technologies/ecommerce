"use client";

import { Grid, Typography, Box } from "@mui/material";
import type { PublicProduct } from "@/types/product";
import ProductCard from "./ProductCard";

type Props = {
    products: PublicProduct[];
};

export default function ProductGrid({ products }: Props) {
    if (products.length === 0) {
        return (
            <Box textAlign="center" py={6}>
                <Typography color="text.secondary">
                    No products available.
                </Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {products.map((product) => (
                <Grid key={product.productId} size={{ xs: 12, sm: 6, md: 4 }}>
                    <ProductCard product={product} />
                </Grid>
            ))}
        </Grid>
    );
}
