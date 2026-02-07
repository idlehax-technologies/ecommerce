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

import type { Product } from "@/types/product";
import { listProducts } from "@/lib/api/adminProducts";
import ProductList from "@/components/admin/products/ProductList";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setError(null);
        setProducts(await listProducts());
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <Container sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h5">Products</Typography>

        <Button
          component={Link}
          href="/admin/products/new"
          variant="contained"
        >
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
