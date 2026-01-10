"use client";

import { useState, createContext, useContext, useEffect } from "react";
import type { CartItem, CartContextType, AddToCartInput } from "@/types/cart";

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        if (typeof window === "undefined") return [];
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : [];
    });

    const [orderAttempted, setOrderAttempted] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    function addToCart(product: AddToCartInput) {
        setItems((items) => {
            const item = items.find((i) => i.productId === product.productId);

            if (item) {
                return items.map((i) =>
                    i.productId === product.productId
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }

            return [...items, { ...product, quantity: 1 }];
        });
    }

    function removeFromCart(productId: number) {
        setItems((items) => items.filter((i) => i.productId !== productId));
    }

    function clearCart() {
        setItems([]);
    }

    function placeOrder() {
        setOrderAttempted(true);
        setOrderPlaced(true);
        setItems([]);
    }

    function failOrder() {
        setOrderAttempted(true);
        setOrderPlaced(false);
    }

    function resetOrderState() {
        setOrderAttempted(false);
        setOrderPlaced(false)
    }

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    return (
        <CartContext.Provider value={{
            items, addToCart, removeFromCart, clearCart, placeOrder, failOrder, resetOrderState, orderAttempted, orderPlaced,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used inside CartProvider");
    }
    return context;
}
