"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import type { TenantProvisioningRow } from "@/lib/mappers/tenantProvisioningView";

type Props = {
  row: TenantProvisioningRow;
};

export default function ProductCard({ row }: Props) {
  const { product, stock } = row;

  const price = (product.price / 100).toFixed(2);
  const image = product.images?.[0];

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {image && (
        <CardMedia
          component="img"
          height="180"
          image={image}
          alt={product.title}
        />
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={0.25}>
          <Typography variant="h6">
            {product.title}
          </Typography>

          <Typography fontWeight={600}>
            ₹ {price}
          </Typography>

          <Chip
            label={
              stock > 0
                ? `In stock (${stock})`
                : "Out of stock"
            }
            color={stock > 0 ? "success" : "error"}
            size="small"
            sx={{ width: "fit-content" }}
          />
        </Stack>
      </CardContent>

      <CardActions>
        <Button
          component={Link}
          href={`/home/${product.productId}`}
          size="small"
          fullWidth
          variant="outlined"
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}