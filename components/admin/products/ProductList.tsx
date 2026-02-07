"use client";

import {
  Grid,
  Typography,
  Box,
} from "@mui/material";

import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";

export default function ProductList({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <Box textAlign="center" py={6}>
        <Typography color="text.secondary">
          No products yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {products.map((product) => (
        <Grid
          key={product.productId}
          size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
        >
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
