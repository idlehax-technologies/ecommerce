"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";

import * as api from "@/lib/api/cart";

import type {
    Cart,
    CartContextValue,
} from "@/types/cart";

const CartContext =
    createContext<CartContextValue | null>(null);

export function CartProvider({
    children,
}: {
    children: React.ReactNode;
}) {

    const [cart, setCart] =
        useState<Cart | null>(null);

    const refresh = useCallback(async () => {

        const res = await api.getCart();

        setCart(res.cart);

    }, []);

    const add = useCallback(async (
        productId: string
    ) => {

        const res = await api.addToCart({
            productId,
        });

        setCart(res.cart);

    }, []);

    const update = useCallback(async (
        productId: string,
        quantity: number
    ) => {

        const res = await api.updateItem(
            productId,
            { quantity }
        );

        setCart(res.cart);

    }, []);

    const remove = useCallback(async (
        productId: string
    ) => {

        const res = await api.removeItem(
            productId
        );

        setCart(res.cart);

    }, []);

    const clear = useCallback(async () => {

        await api.clearCart();

        setCart(null);

    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return (
        <CartContext.Provider
            value={{
                cart,
                refresh,
                add,
                update,
                remove,
                clear,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {

    const ctx = useContext(CartContext);

    if (!ctx) {
        throw new Error(
            "CartProvider missing"
        );
    }

    return ctx;
}