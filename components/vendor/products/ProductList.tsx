"use client";

import { Grid, Typography } from "@mui/material";
import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";

export default function ProductList({ products }: { products: Product[] }) {
  if (products.length === 0)
    return <Typography>No products yet.</Typography>;

  return (
    <Grid container spacing={2}>
      {products.map((product) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.productId}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
