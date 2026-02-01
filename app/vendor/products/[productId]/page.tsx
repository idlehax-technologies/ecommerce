"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Paper, Typography, CircularProgress, Stack, Alert } from "@mui/material";

import ProductForm from "@/components/vendor/products/ProductForm";
import {
  getVendorProduct,
  updateVendorProduct,
  deleteVendorProduct,
} from "@/lib/api/vendorProducts";
import type { Product } from "@/types/product";
import { UpdateProductDTO } from "@/types/product.dto";

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const product = await getVendorProduct(productId);
        setProduct(product);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [productId]);

  async function handleUpdate(values: UpdateProductDTO) {
    try {
      setError(null);

      const updated = await updateVendorProduct(productId, values);
      setProduct(updated);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update");
    }
  }

  async function handleDelete() {
    try {
      await deleteVendorProduct(productId);
      router.push("/vendor/products");
    } catch (e: unknown) {
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
        <Typography variant="h6" align="center" color="text.secondary">
          Product not found
        </Typography>
      </Container>
    );
  }


  return (
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
  );
}
