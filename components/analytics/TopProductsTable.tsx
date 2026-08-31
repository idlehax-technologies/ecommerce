"use client";

import {
    Stack,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";

import { formatINR } from "@/lib/format/currency";

import type { ProductSales } from "@/types/analytics";

type Props = {
    topProducts: ProductSales[];
};

export default function TopProductsTable({
    topProducts,
}: Props) {

    return (
        <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600}>
                Top Products
            </Typography>

            <TableContainer>
                <Table
                    sx={{
                        tableLayout: "fixed",
                        width: "100%",
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell>SKU</TableCell>
                            <TableCell align="center">Units Sold</TableCell>
                            <TableCell align="right">Gross Revenue</TableCell>
                            <TableCell align="right">Discount Given</TableCell>
                            <TableCell align="right">Net Revenue</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {topProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No product sales available.
                                </TableCell>
                            </TableRow>
                        ) : (
                            topProducts.map((product) => (
                                <TableRow key={product.productId}>
                                    <TableCell>
                                        {product.title}
                                    </TableCell>

                                    <TableCell>
                                        {product.sku}
                                    </TableCell>

                                    <TableCell align="center">
                                        {product.unitsSold}
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatINR(product.grossRevenue)}
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatINR(product.discountGiven)}
                                    </TableCell>

                                    <TableCell align="right">
                                        {formatINR(product.netRevenue)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
}