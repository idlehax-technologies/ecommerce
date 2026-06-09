"use client";

import {
    Table, TableHead, TableRow, TableCell, TableBody,
    Typography, Box
} from "@mui/material";

import type { TenantProvisioningRow } from "@/lib/mappers/tenantProvisioningView";
import ProvisionStatusIndicator from "./ProvisionStatusIndicator";

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
                    <TableCell>Stock</TableCell>
                    <TableCell>Reserved</TableCell>
                    <TableCell>Available</TableCell>
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
                            {row.stock}
                        </TableCell>

                        <TableCell>
                            {row.reserved}
                        </TableCell>

                        <TableCell>
                            {row.stock - row.reserved}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}