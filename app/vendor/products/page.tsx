"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Container,
  Typography,
  Button,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";

import { listVendorProducts } from "@/lib/api/vendorProducts";
import type { Product } from "@/types/product";
import ProductList from "@/components/vendor/products/ProductList";

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setProducts(await listVendorProducts());
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unexpected error";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <Container sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h5">Your Products</Typography>
        <Button component={Link} href="/vendor/products/new" variant="contained">
          New Product
        </Button>
      </Stack>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <ProductList products={products} />
      )}
    </Container>
  );
}
