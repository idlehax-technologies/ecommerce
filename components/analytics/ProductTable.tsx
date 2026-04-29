"use client";

import {
    Table, TableHead, TableRow, TableCell, TableBody, Typography
} from "@mui/material";

import type { ProductSales } from "@/types/analytics";

export default function ProductTable({
    products,
}: {
    products: ProductSales[];
}) {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Units</TableCell>
                    <TableCell>Revenue</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {products.map((p) => (
                    <TableRow key={p.productId}>
                        <TableCell>{p.name}</TableCell>
                        <TableCell>{p.unitsSold}</TableCell>
                        <TableCell>
                            ₹ {(p.revenue / 100).toFixed(2)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}