"use client";

import {
    Table, TableHead, TableRow, TableCell, TableBody,
    Typography, Box
} from "@mui/material";

import type { TenantProvisioningRow } from "@/lib/mappers/tenantProvisioningView";
import EnableToggle from "./EnableToggle";
import ProvisionStatusIndicator from "./ProvisionStatusIndicator";
import AdjustmentInput from "./AdjustmentInput";

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
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Enabled</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Reserved</TableCell>
                    <TableCell>Available</TableCell>
                    <TableCell>Stock Adjustment</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {rows.map(row => (
                    <TableRow key={row.product.productId}>
                        <TableCell>
                            <Box>
                                <Typography fontWeight={500}>
                                    {row.product.title}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    ₹{row.product.price / 100}
                                </Typography>
                            </Box>
                        </TableCell>

                        <TableCell>
                            {row.product.sku}
                        </TableCell>

                        <TableCell>
                            <ProvisionStatusIndicator row={row} />
                        </TableCell>

                        <TableCell>
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

                        <TableCell>
                            {row.stock}
                        </TableCell>

                        <TableCell>
                            {row.reserved}
                        </TableCell>

                        <TableCell>
                            {row.stock - row.reserved}
                        </TableCell>

                        <TableCell>
                            <AdjustmentInput
                                tenantId={tenantId}
                                row={row}
                                onChange={(stock) =>
                                    onRowChange(
                                        row.product.productId,
                                        { stock }
                                    )
                                }
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}