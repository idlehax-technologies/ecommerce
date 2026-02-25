"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, CircularProgress, Alert, Button, Typography } from "@mui/material";

import type { PublicProduct } from "@/types/product";
import { getProduct } from "@/lib/api/products";
import ProductDetail from "@/components/products/ProductDetail";

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
          Back to products
        </Button>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ mt: 6, textAlign: "center" }}>
        <Typography>Product not found</Typography>
        <Button onClick={() => router.push("/products")}>Back to products</Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 6 }}>
      <ProductDetail product={product} />
    </Container>
  );
}
