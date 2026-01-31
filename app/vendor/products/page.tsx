"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import ProductList from "@/components/vendor/products/ProductList";
import { listVendorProducts } from "@/lib/api/vendorProducts";
import type { Product } from "@/types/product";

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listVendorProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">My Products</Typography>

        <Button
          component={Link}
          href="/vendor/products/new"
          variant="contained"
        >
          Add Product
        </Button>
      </Box>

      <ProductList products={products} loading={loading} />
    </Box>
  );
}
