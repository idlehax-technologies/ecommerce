// lib/tenantInventory/storage.ts

import type { TenantInventory } from "@/types/tenantInventory";

/**
 * Global store (HMR-safe)
 */
const globalForTenantInventory = globalThis as unknown as {
    __tenantInventoryStore?: Map<string, TenantInventory>;
};

const store: Map<string, TenantInventory> =
    globalForTenantInventory.__tenantInventoryStore ?? new Map();

globalForTenantInventory.__tenantInventoryStore = store;

/**
 * Key format: `${tenantId}::${productId}`
 * This models a join-table primary key.
 */
const keyOf = (tenantId: string, productId: string) =>
    `${tenantId}::${productId}`;

export const tenantInventoryStore = {
    get(tenantId: string, productId: string): TenantInventory | undefined {
        return store.get(keyOf(tenantId, productId));
    },

    listByTenant(tenantId: string): TenantInventory[] {
        return Array.from(store.values()).filter(
            (r) => r.tenantId === tenantId
        );
    },

    save(record: TenantInventory) {
        store.set(keyOf(record.tenantId, record.productId), record);
    },

    delete(tenantId: string, productId: string) {
        store.delete(keyOf(tenantId, productId));
    },
};