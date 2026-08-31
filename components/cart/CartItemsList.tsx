"use client";

import { Stack } from "@mui/material";
import CartItemRow from "./CartItemRow";

import type {
    TenantProductRow,
} from "@/lib/mappers/tenantProductView";
import type { CartView } from "@/lib/mappers/cartView";

export default function CartItemsList({
    cart,
    rows,
    removeItem,
    registerUndo,
}: {
    cart: CartView;
    rows: TenantProductRow[];
    removeItem?: (productId: string) => Promise<void>;
    registerUndo?: (undo: () => void) => void;
}) {
    return (
        <Stack spacing={2}>
            {cart.items.map((item) => {
                const row = rows.find((row) =>
                    row.product.productId === item.productId
                );

                if (!row) {
                    throw new Error(
                        `Missing tenant product for cart item ${item.productId}`,
                    );
                }

                return (
                    <CartItemRow
                        key={item.productId}
                        item={item}
                        row={row}
                        removeItem={removeItem}
                        registerUndo={registerUndo}
                    />
                );
            })}
        </Stack>
    );
}