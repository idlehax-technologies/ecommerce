"use client";
import { createContext, useContext, useEffect, useState } from "react";
import * as api from "@/lib/api/cart";
import type { Cart, CartContextValue } from "@/types/cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<Cart | null>(null);

    async function refresh() {
        setCart(await api.getCart());
    }

    async function add(productId: string) {
        setCart(await api.addToCart({ productId }));
    }

    async function update(productId: string, quantity: number) {
        setCart(await api.updateItem(productId, { quantity }));
    }

    async function remove(productId: string) {
        setCart(await api.removeItem(productId));
    }

    async function clear() {
        await api.clearCart();
        await refresh();
    }

    useEffect(() => {
        refresh();
    }, []);

    return (
        <CartContext.Provider value={{ cart, refresh, add, update, remove, clear }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("CartProvider missing");
    return ctx;
}
