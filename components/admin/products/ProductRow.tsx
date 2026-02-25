"use client";

import Link from "next/link";
import { TableRow, TableCell, Button, Stack } from "@mui/material";

import type { Product } from "@/types/product";

function formatINR(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(paise / 100);
}

export default function ProductRow({ product }: { product: Product }) {
  return (
    <TableRow hover>
      <TableCell>{product.title}</TableCell>
      <TableCell>{formatINR(product.price)}</TableCell>
      <TableCell>{product.category ?? "—"}</TableCell>

      <TableCell align="right">
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            component={Link}
            href={`/platform/products/${product.productId}`}
            size="small"
          >
            Edit
          </Button>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
