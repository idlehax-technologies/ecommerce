"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  CardMedia,
} from "@mui/material";
import type { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images?.[0];

  return (
    <Card sx={{ height: "100%" }}>
      <CardActionArea
        component={Link}
        href={`/vendor/products/${product.productId}`}
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
          <Typography variant="subtitle1" fontWeight={600}>
            {product.title}
          </Typography>

          <Typography variant="body2">
            ₹ {product.price / 100}
          </Typography>

          <Typography variant="caption">
            Stock: {product.stock}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
