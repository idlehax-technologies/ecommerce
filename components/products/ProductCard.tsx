"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import type { PublicProduct } from "@/types/product";

type Props = {
  product: PublicProduct;
};

export default function ProductCard({ product }: Props) {
  const image =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <Link
      href={`/products/${product.productId}`}
      style={{ textDecoration: "none" }}
    >
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          transition: "0.15s ease",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: 6,
          },
        }}
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
              variant="h6"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {product.title}
            </Typography>

            {/* Price */}
            <Typography variant="subtitle1" fontWeight={600}>
              ₹{product.price}
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
      </Card>
    </Link>
  );
}
