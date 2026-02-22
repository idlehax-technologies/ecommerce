"use client";

import { useEffect, useState } from "react";
import { Container, Typography, CircularProgress, Box } from "@mui/material";

import type { PublicProduct } from "@/types/product";
import { listProducts } from "@/lib/api/products";
import ProductGrid from "@/components/products/ProductGrid";

export default function Home() {
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await listProducts();
        setProducts(data);
      } catch {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Products
      </Typography>

      {loading && (
        <Box textAlign="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      )}

      {!loading && !error && (
        <ProductGrid products={products} />
      )}
    </Container>
  );
}
