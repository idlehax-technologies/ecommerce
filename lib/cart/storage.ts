import type { Cart } from "@/types/cart";

/**
 * We anchor the cart map on globalThis so that:
 * - Next.js hot reload does NOT recreate the store
 * - The in-memory cart behaves like a stable process store
 * - We still keep carts ephemeral (no persistence beyond runtime)
 */

type GlobalWithCartStore = typeof globalThis & {
    __cartStore?: Map<string, Cart>;
};

const globalForCart = globalThis as GlobalWithCartStore;

/**
 * Reuse existing store if it exists, otherwise create it.
 */
const cartStore: Map<string, Cart> =
    globalForCart.__cartStore ?? new Map<string, Cart>();

globalForCart.__cartStore = cartStore;

function keyOf(
    tenantId: string,
    userId: string
): string {
    return `${tenantId}:${userId}`;
}

function cloneCart(cart: Cart): Cart {
    return {
        ...cart,
        items: cart.items.map((item) => ({ ...item })),
    };
}

/**
 * Cart access is always:
 * - tenant-scoped
 * - user-scoped
 */

export function getCart(
    tenantId: string,
    userId: string
): Cart {

    const key = keyOf(
        tenantId,
        userId
    );

    let cart = cartStore.get(key);

    if (!cart) {

        cart = {
            tenantId,
            userId,
            items: [],
            updatedAt: new Date().toISOString(),
        };

        cartStore.set(
            key,
            cloneCart(cart)
        );
    }

    return cloneCart(cart);
}

export function saveCart(
    cart: Cart
): void {

    const updated: Cart = {
        ...cart,
        updatedAt: new Date().toISOString(),
        items: cart.items.map((item) => ({ ...item })),
    };

    cartStore.set(
        keyOf(
            updated.tenantId,
            updated.userId
        ),
        updated
    );
}

export function clearCart(
    tenantId: string,
    userId: string
): void {

    cartStore.delete(
        keyOf(
            tenantId,
            userId
        )
    );
}