"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Typography,
  CircularProgress,
  Button,
  Stack,
  Alert,
  Chip,
} from "@mui/material";

import type { PublicProduct } from "@/types/product";
import { getProduct } from "@/lib/api/products";

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const p = await getProduct(productId);
        setProduct(p);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [productId]);

  if (loading) {
    return (
      <Container sx={{ mt: 6, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 6 }}>
        <Alert severity="error">{error}</Alert>
        <Button sx={{ mt: 2 }} onClick={() => router.push("/products")}>
          Back
        </Button>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ mt: 6, textAlign: "center" }}>
        <Typography>Product not found</Typography>
        <Button onClick={() => router.push("/products")}>Back</Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 6 }}>
      <Stack spacing={2}>
        <Typography variant="h4">{product.title}</Typography>

        <Typography fontWeight={600}>
          ₹ {(product.price / 100).toFixed(2)}
        </Typography>

        <Chip
          label={
            product.stock > 0
              ? `In stock (${product.stock} available)`
              : "Out of stock (0 available)"
          }
          color={product.stock > 0 ? "success" : "error"}
          size="small"
          sx={{ width: "fit-content" }}
        />

        {product.description && (
          <Typography color="text.secondary">
            {product.description}
          </Typography>
        )}
      </Stack>
    </Container>
  );
}
