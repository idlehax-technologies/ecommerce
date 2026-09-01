"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
    Alert,
    CircularProgress,
} from "@mui/material";

import POSDashboard from "./POSDashboard";

import { useSnackbar } from "@/contexts/SnackbarContext";

import { createPOSOrder } from "@/lib/api/pos";
import { getTenant } from "@/lib/api/tenants";
import { getTenantProductView } from "@/lib/api/tenantInventory";

import type { Tenant } from "@/types/tenant";
import type { TenantProductRow } from "@/lib/mappers/tenantProductView";

export default function POSClient() {

    const router = useRouter();
    const { show } = useSnackbar();

    const [rows, setRows] = useState<TenantProductRow[]>([]);
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [cart, setCart] = useState<Record<string, number>>({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function load() {
        try {
            setLoading(true);
            setError(null);

            const [productRes, tenantRes] = await Promise.all([
                getTenantProductView(),
                getTenant(),
            ]);

            setRows(productRes.rows);
            setTenant(tenantRes.tenant);

        } catch (err: unknown) {

            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to load POS");
            }

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    function add(productId: string) {
        const row = rows.find(
            (row) => row.product.productId === productId
        );

        if (!row) {
            return;
        }

        const quantity = cart[productId] ?? 0;

        if (quantity >= row.available) {
            return;
        }

        setCart((current) => ({
            ...current,
            [productId]: quantity + 1,
        }));
    }

    function update(
        productId: string,
        quantity: number
    ) {
        const row = rows.find(
            (row) => row.product.productId === productId
        );

        if (!row) {
            return;
        }

        if (quantity <= 0) {
            setCart((current) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [productId]: _, ...rest } = current;
                return rest;
            });

            return;
        }

        if (quantity > row.available) {
            return;
        }

        setCart((current) => ({
            ...current,
            [productId]: quantity,
        }));
    }

    function removeUnavailableProducts(
        productIds: string[]
    ) {
        setCart((current) => {
            const next = { ...current };

            for (const productId of productIds) {
                delete next[productId];
            }

            return next;
        });
    }

    async function submit() {
        try {
            const result = await createPOSOrder({
                items: Object.entries(cart)
                    .map(([productId, quantity]) => ({
                        productId,
                        quantity,
                    })),
            });

            if ("removedItems" in result) {
                removeUnavailableProducts(
                    result.removedItems.map(
                        (item) => item.productId
                    )
                );

                show(
                    "Unavailable products were removed from the order",
                    "warning"
                );

                return;
            }

            setCart({});

            router.push(
                `/orders/${result.order.orderId}`
            );

        } catch (err: unknown) {

            if (err instanceof Error) {
                show(err.message, "error");
            } else {
                show("Failed to create POS order", "error");
            }
        }
    }

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return (
            <Alert severity="error">
                {error}
            </Alert>
        );
    }

    if (!tenant) {
        return null;
    }

    return (
        <POSDashboard
            rows={rows}
            cart={cart}
            hasGst={!!tenant.gstin}
            onAdd={add}
            onUpdate={update}
            onSubmit={submit}
        />
    );
}