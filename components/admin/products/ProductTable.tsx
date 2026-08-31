"use client";

import Link from "next/link";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Button,
} from "@mui/material";

import ProductStatusBadge from "./ProductStatusBadge";
import { formatINR } from "@/lib/format/currency";
import type { Product } from "@/types/product";

export default function ProductTable({
  products,
}: {
  products: Product[];
}) {

  return (
    <TableContainer>
      <Table
        sx={{
          tableLayout: "fixed",
          width: "100%",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "26%" }}>
              Product
            </TableCell>
            <TableCell sx={{ width: "16%" }}>
              SKU
            </TableCell>
            <TableCell sx={{ width: "12%" }}>
              Status
            </TableCell>
            <TableCell sx={{ width: "16%" }}>
              Category
            </TableCell>
            <TableCell sx={{ width: "16%" }}>
              Price
            </TableCell>
            <TableCell align="center" sx={{ width: "14%" }}>
              Details
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((product) => (
            <TableRow key={product.productId}>
              <TableCell>
                {product.title}
              </TableCell>

              <TableCell>
                {product.sku}
              </TableCell>

              <TableCell>
                <ProductStatusBadge
                  status={product.status}
                />
              </TableCell>

              <TableCell>
                {product.category}
              </TableCell>

              <TableCell>
                {formatINR(product.price)}
              </TableCell>

              <TableCell align="center">
                <Button
                  component={Link}
                  href={`/platform/products/${product.productId}`}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}