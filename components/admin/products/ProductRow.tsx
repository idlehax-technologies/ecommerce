"use client";

import Link from "next/link";

import {
  TableRow,
  TableCell,
  IconButton,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

import type { Product } from "@/types/product";

import ProductStatusBadge from "./ProductStatusBadge";

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
      <TableCell>{product.sku}</TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell>{formatINR(product.price)}</TableCell>

      <TableCell>
        <ProductStatusBadge status={product.status} />
      </TableCell>

      <TableCell align="right">
        <IconButton
          component={Link}
          href={`/platform/products/${product.productId}`}
        >
          <EditIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}