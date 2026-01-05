"use client";

import { useState, createContext, useContext } from "react";

type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
};

type CartContextType = {
    items: CartItem[];
    addToCart: (product: { id: number; name: string; price: number }) => void;
    removeFromCart: (id: number) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    function addToCart(product: { id: number; name: string; price: number }) {
        setItems((items) => {
            const item = items.find((i) => i.id === product.id);

            if (item) {
                return items.map((i) =>
                    i.id === product.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }

            return [...items, { ...product, quantity: 1 }];
        });
    }

    function removeFromCart(id: number) {
        setItems((items) => items.filter((i) => i.id !== id));
    }

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart }}>
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
