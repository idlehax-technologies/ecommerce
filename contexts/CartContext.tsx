"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";

import * as cartApi from "@/lib/api/cart";
import type { CartView } from "@/lib/mappers/cartView";

type CartContextValue = {
    cart: CartView | null;
    loading: boolean;

    refresh: () => Promise<void>;
    add: (id: string) => Promise<void>;
    update: (id: string, q: number) => Promise<void>;
    remove: (id: string) => Promise<void>;
    clear: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [cart, setCart] = useState<CartView | null>(null);

    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            const res = await cartApi.getCart();
            setCart(res.cart);
        } catch {
            // Not an error condition for UI — this actor may not have cart access.
            setCart(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const add = useCallback(
        async (productId: string) => {
            const res = await cartApi.addToCart({ productId, });
            setCart(res.cart);
        }, []);

    const update = useCallback(
        async (productId: string, quantity: number) => {
            const res = await cartApi.updateItem(productId, { quantity });
            setCart(res.cart);
        }, []);

    const remove = useCallback(
        async (productId: string) => {
            const res = await cartApi.removeItem(productId);
            setCart(res.cart);
        }, []);

    const clear = useCallback(async () => {
        await cartApi.clearCart();
        setCart(null);
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
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
            "useCart must be used within CartProvider"
        );
    }

    return ctx;
}