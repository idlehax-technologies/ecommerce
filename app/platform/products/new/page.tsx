"use client";

import { Container, Typography, Paper, Alert, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { CreateProductDTO } from "@/types/product";
import { createProduct } from "@/lib/api/productManagement";
import ProductForm from "@/components/admin/products/ProductForm";

export default function NewProductPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(values: CreateProductDTO) {
    setLoading(true);
    setError(null);

    try {
      const product = await createProduct(values);

      router.push(`/admin/products/${product.productId}`);
    } catch (e) {
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
