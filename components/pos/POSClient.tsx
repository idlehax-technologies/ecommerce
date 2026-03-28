"use client";

import { useEffect, useState } from "react";
import { Grid, Stack, Alert } from "@mui/material";

import POSProductGrid from "./POSProductGrid";
import POSCart from "./POSCart";

import { getTenantInventoryView } from "@/lib/api/tenantInventory";
import { createPOSOrder } from "@/lib/api/orders";

import { mapToPOSRows } from "@/lib/mappers/posView";
import type { POSRow } from "@/lib/mappers/posView";
import type { TenantProvisioningRow } from "@/lib/mappers/tenantProvisioningView";

type BaseRow = TenantProvisioningRow;

type POSRowWithAction = POSRow & {
    onSelect: () => void;
};

export default function POSClient() {
    const [rows, setRows] = useState<BaseRow[]>([]);
    const [cart, setCart] = useState<Record<string, number>>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getTenantInventoryView("tenant-demo")
            .then((res) => setRows(res.rows))
            .catch(() => setError("Failed to load products"));
    }, []);

    const posRows: POSRow[] = mapToPOSRows(rows, cart);

    const rowsWithActions: POSRowWithAction[] = posRows.map((r) => ({
        ...r,
        onSelect: () => add(r.product.productId),
    }));

    function add(productId: string) {
        const row = posRows.find((r) => r.product.productId === productId);
        if (!row) return;

        if (row.available <= 0) return;

        setCart((c) => ({
            ...c,
            [productId]: (c[productId] || 0) + 1,
        }));
    }

    function update(productId: string, nextQty: number) {
        const row = rows.find((r) => r.product.productId === productId);
        if (!row) return;

        if (nextQty <= 0) {
            const { [productId]: _, ...rest } = cart;
            setCart(rest);
            return;
        }

        if (nextQty > row.stock) return;

        setCart((c) => ({
            ...c,
            [productId]: nextQty,
        }));
    }

    async function submit(paymentMethod?: string) {
        try {
            await createPOSOrder({
                items: Object.entries(cart).map(([productId, quantity]) => ({
                    productId,
                    quantity,
                })),
                paymentMethod,
            });

            window.location.reload();
        } catch (e: any) {
            setError(e.message);
        }
    }

    return (
        <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
                <POSProductGrid rows={rowsWithActions} />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                <Stack spacing={2}>
                    {error && <Alert severity="error">{error}</Alert>}

                    <POSCart
                        cart={cart}
                        rows={rows}
                        onUpdate={update}
                        onSubmit={submit}
                    />
                </Stack>
            </Grid>
        </Grid>
    );
}