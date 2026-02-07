"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  CardMedia,
  Stack,
} from "@mui/material";

import type { Product } from "@/types/product";

function formatINR(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(paise / 100);
}

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images?.[0];

  return (
    <Card sx={{ height: "100%" }}>
      <CardActionArea
        component={Link}
        href={`/admin/products/${product.productId}`}   // ✅ fixed route
      >
        {image && (
          <CardMedia
            component="img"
            height="160"
            image={image}
            alt={product.title}
          />
        )}

        <CardContent>
          <Stack spacing={0.5}>
            <Typography fontWeight={600}>
              {product.title}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {formatINR(product.price)}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Stock: {product.stock}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
