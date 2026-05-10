"use client";

import {
    Table, TableHead, TableRow, TableCell, TableBody,
    Button, Typography, TextField, Stack,
    Alert
} from "@mui/material";

import { useState, useTransition } from "react";
import { adjustStock } from "@/lib/api/stockAdjustment";

import type { LowStockItem } from "@/types/lowStock";

function generateKey() {
    return crypto.randomUUID();
}

type Props = {
    tenantId: string;
    items: LowStockItem[];
};

export default function LowStockTable({ tenantId, items }: Props) {

    const [pending, start] = useTransition();

    const [inputs, setInputs] = useState<Record<string, number | undefined>>({});

    function setValue(productId: string, value: number | undefined) {
        setInputs(prev => ({ ...prev, [productId]: value }));
    }

    const [errors, setErrors] = useState<Record<string, string>>({});

    function resolve(productId: string) {

        const newStock = inputs[productId];

        if (newStock === undefined) {
            setErrors(prev => ({
                ...prev,
                [productId]: "Stock value required",
            }));
            return;
        }

        if (Number.isNaN(newStock) || newStock < 0) {
            setErrors(prev => ({
                ...prev,
                [productId]: "Enter valid non-negative number",
            }));
            return;
        }

        setErrors(prev => {
            const next = { ...prev };
            delete next[productId];
            return next;
        });

        start(async () => {
            try {
                await adjustStock(tenantId, {
                    idempotencyKey: generateKey(),
                    productId,
                    newStock,
                });

                window.location.reload();

            } catch (err: any) {
                setErrors(prev => ({
                    ...prev,
                    [productId]: err?.message || "Adjustment failed",
                }));
            }
        });
    }

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Reserved</TableCell>
                    <TableCell>Available</TableCell>
                    <TableCell>Adjust</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {items.map((i) => (
                    <TableRow key={i.productId}>
                        <TableCell>{i.productId}</TableCell>

                        <TableCell>{i.stock}</TableCell>

                        <TableCell>{i.reserved}</TableCell>

                        <TableCell>
                            <Typography color="error">
                                {i.available}
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Stack direction="column" spacing={1}>
                                <Stack direction="row" spacing={1}>
                                    <TextField
                                        size="small"
                                        type="number"
                                        placeholder="New stock"
                                        value={inputs[i.productId] ?? ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setValue(
                                                i.productId,
                                                value === "" ? undefined : Number(value)
                                            );
                                        }}
                                        error={!!errors[i.productId]}
                                    />

                                    <Button
                                        disabled={pending || inputs[i.productId] === undefined}
                                        onClick={() => resolve(i.productId)}
                                    >
                                        Apply
                                    </Button>
                                </Stack>

                                {errors[i.productId] && (
                                    <Alert severity="error">
                                        {errors[i.productId]}
                                    </Alert>
                                )}
                            </Stack>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}