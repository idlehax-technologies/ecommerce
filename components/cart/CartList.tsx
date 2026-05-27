"use client";

import { Stack } from "@mui/material";

import CartRow from "./CartRow";

import type { Cart } from "@/types/cart";

type Props = {
    cart: Cart;
    removeItem?: (
        productId: string
    ) => Promise<void>;
    registerUndo?: (
        undo: () => void
    ) => void;
};

export default function CartList({
    cart,
    removeItem,
    registerUndo,
}: Props) {

    return (
        <Stack spacing={2}>

            {cart.items.map((item) => (

                <CartRow
                    key={item.productId}
                    item={item}
                    removeItem={removeItem}
                    registerUndo={registerUndo}
                />

            ))}

        </Stack>
    );
}