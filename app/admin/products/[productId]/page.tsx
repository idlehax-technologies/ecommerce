"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  CircularProgress,
  Stack,
  Alert,
} from "@mui/material";

import ProductForm from "@/components/admin/products/ProductForm";
import { getProduct, updateProduct, deleteProduct } from "@/lib/api/productManagement";

import type { Product } from "@/types/product";
import type { UpdateProductPatch } from "@/types/product";
import RoleGuard from "@/components/RoleGuard";

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await getProduct(productId);
        setProduct(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [productId]);

  async function handleUpdate(values: UpdateProductPatch) {
    try {
      const updated = await updateProduct(productId, values);
      setProduct(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update");
    }
  }

  async function handleDelete() {
    try {
      await deleteProduct(productId);
      router.push("/admin/products");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    }
  }

  if (loading) {
    return (
      <Container sx={{ py: 6 }}>
        <Stack alignItems="center">
          <CircularProgress />
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography align="center" color="text.secondary">
          Product not found
        </Typography>
      </Container>
    );
  }

  return (
    <RoleGuard allow={["admin"]}>
      <Container sx={{ py: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>
            Edit Product
          </Typography>

          <ProductForm
            mode="edit"
            initial={product}
            onSubmit={handleUpdate}
            onDelete={handleDelete}
          />
        </Paper>
      </Container>
    </RoleGuard>
  );
}
