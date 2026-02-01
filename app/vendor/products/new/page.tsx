"use client";

import { Container, Typography, Paper, Stack, CircularProgress, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/vendor/products/ProductForm";
import { createVendorProduct } from "@/lib/api/vendorProducts";
import { CreateProductDTO } from "@/types/product.dto";
import { useState } from "react";

export default function NewProductPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(values: CreateProductDTO) {
    try {
      setError(null);
      setLoading(true);

      const product = await createVendorProduct(values);

      router.push(`/vendor/products/${product.productId}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Create Product
        </Typography>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        <ProductForm mode="create" onSubmit={handleCreate} />
      </Paper>
    </Container>
  );
}
