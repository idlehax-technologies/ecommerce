"use client";

import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Typography,
    Box,
} from "@mui/material";

import type { TenantProvisioningRow } from "@/lib/mappers/tenantProvisioningView";
import TenantInventoryStatusBadge from "./TenantInventoryStatusBadge";
import { formatINR } from "@/lib/format/currency";

type Props = {
    rows: TenantProvisioningRow[];
};

export default function TenantInventoryTable({ rows }: Props) {

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
                        <TableCell sx={{ width: "37%" }}>
                            Product
                        </TableCell>

                        <TableCell sx={{ width: "18%" }}>
                            SKU
                        </TableCell>

                        <TableCell sx={{ width: "18%" }}>
                            Status
                        </TableCell>

                        <TableCell align="center" sx={{ width: "9%" }}>
                            Stock
                        </TableCell>

                        <TableCell align="center" sx={{ width: "9%" }}>
                            Reserved
                        </TableCell>

                        <TableCell align="center" sx={{ width: "9%" }}>
                            Available
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.product.productId}>
                            <TableCell>
                                <Box>
                                    <Typography fontWeight={600}>
                                        {row.product.title}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {formatINR(row.product.price)}
                                    </Typography>
                                </Box>
                            </TableCell>

                            <TableCell>
                                {row.product.sku}
                            </TableCell>

                            <TableCell>
                                <TenantInventoryStatusBadge row={row} />
                            </TableCell>

                            <TableCell align="center">
                                {row.stock}
                            </TableCell>

                            <TableCell align="center">
                                {row.reserved}
                            </TableCell>

                            <TableCell align="center">
                                {row.available}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}