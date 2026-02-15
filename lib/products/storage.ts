import type { Product } from "@/types/product";

/**
 * Dev-only in-memory persistence.
 * Domain must not know how data is stored.
 */

const globalForProducts = globalThis as any;

const store: Map<string, Product> =
    globalForProducts.products ?? new Map();

globalForProducts.products = store;

export const productStore = {
    get(id: string): Product | undefined {
        return store.get(id);
    },

    getAll(): Product[] {
        return Array.from(store.values());
    },

    save(p: Product) {
        store.set(p.productId, p);
    },

    delete(id: string) {
        store.delete(id);
    }
};
