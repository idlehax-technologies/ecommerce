import type { TenantInventory } from "@/types/tenantInventory";

const globalForTenantInventory = globalThis as unknown as {
    __tenantInventoryStore?: Map<string, TenantInventory>;
};

const store: Map<string, TenantInventory> =
    globalForTenantInventory.__tenantInventoryStore ?? new Map();

globalForTenantInventory.__tenantInventoryStore = store;

const keyOf = (tenantId: string, productId: string) =>
    `${tenantId}::${productId}`;

export const tenantInventoryStore = {

    get(
        tenantId: string,
        productId: string
    ): TenantInventory | undefined {

        const record = store.get(
            keyOf(tenantId, productId)
        );

        return record
            ? { ...record }
            : undefined;
    },

    listByTenant(
        tenantId: string
    ): TenantInventory[] {

        return Array
            .from(store.values())
            .filter((r) => r.tenantId === tenantId)
            .map((r) => ({ ...r }));
    },

    save(record: TenantInventory): void {
        store.set(
            keyOf(record.tenantId, record.productId),
            { ...record }
        );
    },

    delete(tenantId: string, productId: string): void {
        store.delete(keyOf(tenantId, productId));
    },

    /**
     * Atomic mutation helper
     */
    update(
        tenantId: string,
        productId: string,
        mutator: (record: TenantInventory) => TenantInventory
    ): TenantInventory | undefined {

        const key = keyOf(tenantId, productId);

        const record = store.get(key);

        if (!record) {
            return undefined;
        }

        const updated = mutator({ ...record });

        store.set(key, { ...updated });

        return { ...updated };
    },
};