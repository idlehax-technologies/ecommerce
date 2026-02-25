"use client";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Box,
} from "@mui/material";

import type { Product } from "@/types/product";
import ProductRow from "./ProductRow";

export default function ProductTable({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <Box textAlign="center" py={6}>
        <Typography color="text.secondary">
          No products yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Category</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((product) => (
            <ProductRow key={product.productId} product={product} />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
