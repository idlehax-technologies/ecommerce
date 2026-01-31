"use client";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import Link from "next/link";
import type { Product } from "@/types/product";

export default function ProductList({
  products,
  loading,
}: {
  products: Product[];
  loading: boolean;
}) {
  if (loading) {
    return <Typography>Loading products...</Typography>;
  }

  if (products.length === 0) {
    return <Typography>No products yet.</Typography>;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Price</TableCell>
          <TableCell>Stock</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {products.map((p) => (
          <TableRow key={p.productId}>
            <TableCell>
              <Link href={`/vendor/products/${p.productId}`}>
                {p.title}
              </Link>
            </TableCell>
            <TableCell>₹{p.price}</TableCell>
            <TableCell>{p.stock}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
