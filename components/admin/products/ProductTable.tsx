"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import type { Product } from "@/types/product";

import ProductRow from "./ProductRow";

export default function ProductTable({ products }: { products: Product[] }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>SKU</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Price (incl. GST)</TableCell>
          <TableCell>Status</TableCell>
          <TableCell align="right" />
        </TableRow>
      </TableHead>

      <TableBody>
        {products.map((product) => (
          <ProductRow
            key={product.productId}
            product={product}
          />
        ))}
      </TableBody>
    </Table>
  );
}