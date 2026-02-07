"use client";

import { useState, createContext, useContext, useEffect } from "react";
import type { CartItemType, CartContextType, AddToCartInput } from "@/types/cart";

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItemType[]>(() => {
        if (typeof window === "undefined") return [];
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : [];
    });

    const [orderAttempted, setOrderAttempted] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const [pendingRemove, setPendingRemove] = useState<{
        productId: string;
        timeoutId: ReturnType<typeof setTimeout>;
    } | null>(null);

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

    function removeFromCart(productId: string) {
        setItems((items) => items.filter((i) => i.productId !== productId));
    }

    function increaseQuantity(productId: string) {
        setItems((items) =>
            items.map((item) =>
                item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    }

    function decreaseQuantity(productId: string) {
        setItems((items) =>
            items
                .map((item) =>
                    item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter((item) => item.quantity > 0)
        );
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
        setOrderPlaced(false);
    }

    function startPendingRemove(productId: string) {
        if (pendingRemove) {
            clearTimeout(pendingRemove.timeoutId);
        }

        const timeoutId = setTimeout(() => {
            removeFromCart(productId);
            setPendingRemove(null);
        }, 3000);

        setPendingRemove({ productId, timeoutId });
    }

    function stopPendingRemove() {
        if (pendingRemove) {
            clearTimeout(pendingRemove.timeoutId);
        }
        setPendingRemove(null);
    }

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                clearCart,
                placeOrder,
                failOrder,
                resetOrderState,
                orderAttempted,
                orderPlaced,
                startPendingRemove,
                stopPendingRemove,
                pendingRemove,
            }}
        >
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
