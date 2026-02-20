import type { Cart } from "@/types/cart";

/**
 * We anchor the cart map on globalThis so that:
 * - Next.js hot reload does NOT recreate the store
 * - The in-memory cart behaves like a stable process store (same as products)
 * - We still keep carts ephemeral (no persistence beyond runtime)
 */

type GlobalWithCartStore = typeof globalThis & {
    __cartStore?: Map<string, Cart>;
};

const globalForCart = globalThis as GlobalWithCartStore;

/**
 * Reuse existing store if it exists, otherwise create it.
 * This mirrors the product storage pattern but keeps cart semantics.
 */
const cartStore: Map<string, Cart> =
    globalForCart.__cartStore ?? new Map<string, Cart>();

globalForCart.__cartStore = cartStore;

/**
 * Cart access is always tenant-scoped.
 * We do NOT expose generic getAll()/get() like a repository,
 * because a cart is an aggregate, not a collection.
 */

export function getCartForTenant(tenantId: string): Cart {
    let cart = cartStore.get(tenantId);

    if (!cart) {
        cart = {
            tenantId,
            items: [],
            updatedAt: new Date().toISOString(),
        };

        cartStore.set(tenantId, cart);
    }

    return cart;
}

export function saveCart(cart: Cart) {
    cart.updatedAt = new Date().toISOString();
    cartStore.set(cart.tenantId, cart);
}

export function clearCart(tenantId: string) {
    cartStore.delete(tenantId);
}
