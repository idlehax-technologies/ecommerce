"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  CardActionArea,
  Box,
} from "@mui/material";

import type { PublicProduct } from "@/types/product";

type Props = {
  product: PublicProduct;
};

/**
 * Pure presentation component
 * - no fetch
 * - no logic
 * - only formatting
 */
export default function ProductCard({ product }: Props) {
  const image =
    product.images?.[0] ??
    "https://via.placeholder.com/400x300?text=No+Image";

  // price stored in paise → convert for UI
  const price = (product.price / 100).toFixed(2);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardActionArea
        component={Link}
        href={`/products/${product.productId}`}
        sx={{ height: "100%" }}
      >
        {/* Image */}
        <CardMedia
          component="img"
          height="180"
          image={image}
          alt={product.title}
        />

        {/* Content */}
        <CardContent sx={{ flexGrow: 1 }}>
          <Stack spacing={1}>
            {/* Title */}
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {product.title}
            </Typography>

            {/* Price */}
            <Typography variant="body1" fontWeight={600}>
              ₹ {price}
            </Typography>

            {/* Stock */}
            <Box>
              <Typography
                variant="body2"
                color={product.stock > 0 ? "text.secondary" : "error"}
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
