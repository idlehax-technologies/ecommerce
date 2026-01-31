"use client";

import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import type { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">
          {product.title}
        </Typography>
        <Typography color="text.secondary">
          ₹{product.price}
        </Typography>
        <Typography>
          Stock: {product.stock}
        </Typography>
      </CardContent>
    </Card>
  );
}
