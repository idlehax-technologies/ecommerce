// components/tenant-provisioning/TenantInventoryTable.tsx

"use client";

import {
    Table, TableHead, TableRow, TableCell, TableBody,
    Typography, Box
} from "@mui/material";

import { useState } from "react";
import type { TenantProvisioningRow } from "@/lib/mappers/tenantProvisioningView";
import EnableToggle from "./EnableToggle";
import StockInput from "./StockInput";
import ProvisionStatusIndicator from "./ProvisionStatusIndicator";

type Props = {
    tenantId: string;
    rows: TenantProvisioningRow[];
    canEdit: boolean;
};

export default function TenantInventoryTable({ tenantId, rows, canEdit }: Props) {
    const [state, setState] = useState(rows);

    function updateRow(productId: string, patch: Partial<TenantProvisioningRow>) {
        setState(prev =>
            prev.map(r =>
                r.product.productId === productId ? { ...r, ...patch } : r
            )
        );
    }

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Enabled</TableCell>
                    <TableCell>Stock</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {state.map(row => (
                    <TableRow key={row.product.productId}>
                        <TableCell>
                            <Box>
                                <Typography fontWeight={500}>{row.product.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ₹{row.product.price / 100}
                                </Typography>
                            </Box>
                        </TableCell>

                        <TableCell>
                            <ProvisionStatusIndicator row={row} />
                        </TableCell>

                        <TableCell>
                            <EnableToggle
                                tenantId={tenantId}
                                row={row}
                                disabled={!canEdit}
                                onChange={(enabled) =>
                                    updateRow(row.product.productId, {
                                        enabled,
                                        isProvisioned: true,
                                    })
                                }
                            />
                        </TableCell>

                        <TableCell>
                            {canEdit ? (
                                <StockInput
                                    tenantId={tenantId}
                                    row={row}
                                    onChange={(stock) =>
                                        updateRow(row.product.productId, {
                                            stock,
                                            isProvisioned: true,
                                        })
                                    }
                                />
                            ) : (
                                <Typography>{row.stock}</Typography>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}