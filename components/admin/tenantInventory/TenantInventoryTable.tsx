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
import EnableToggle from "./EnableToggle";
import AdjustmentInput from "./AdjustmentInput";
import TenantInventoryStatusBadge from "@/components/tenantInventory/TenantInventoryStatusBadge";
import { formatINR } from "@/lib/format/currency";

type Props = {
    tenantId: string;
    rows: TenantProvisioningRow[];
    onRowChange(
        productId: string,
        patch: Partial<TenantProvisioningRow>
    ): void;
};

export default function TenantInventoryTable({
    tenantId,
    rows,
    onRowChange,
}: Props) {

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
                        <TableCell sx={{ width: "25%" }}>
                            Product
                        </TableCell>
                        <TableCell sx={{ width: "12%" }}>
                            SKU
                        </TableCell>
                        <TableCell sx={{ width: "12%" }}>
                            Status
                        </TableCell>
                        <TableCell align="center" sx={{ width: "8%" }}>
                            Enabled
                        </TableCell>
                        <TableCell align="center" sx={{ width: "6%" }}>
                            Stock
                        </TableCell>
                        <TableCell align="center" sx={{ width: "6%" }}>
                            Reserved
                        </TableCell>
                        <TableCell align="center" sx={{ width: "6%" }}>
                            Available
                        </TableCell>
                        <TableCell sx={{ width: "25%" }}>
                            Stock Adjustment
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
                                <EnableToggle
                                    tenantId={tenantId}
                                    row={row}
                                    onChange={(enabled) =>
                                        onRowChange(
                                            row.product.productId,
                                            {
                                                enabled,
                                                isProvisioned: true,
                                            }
                                        )
                                    }
                                />
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

                            <TableCell>
                                <AdjustmentInput
                                    tenantId={tenantId}
                                    row={row}
                                    onChange={(stock, available) =>
                                        onRowChange(
                                            row.product.productId,
                                            {
                                                stock,
                                                available,
                                            }
                                        )
                                    }
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}