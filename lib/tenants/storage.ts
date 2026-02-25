import { Tenant } from "@/types/tenant";

type GlobalTenantStore = {
    __tenantStore?: Map<string, Tenant>;
};

const globalForTenants = globalThis as unknown as GlobalTenantStore;

const store: Map<string, Tenant> =
    globalForTenants.__tenantStore ?? new Map();

globalForTenants.__tenantStore = store;


function seedTenants() {
    if (store.size > 0) return;

    const tenant: Tenant = {
        tenantId: "tenant_alpha",
        name: "Alpha School",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    store.set(tenant.tenantId, tenant);
}

seedTenants();


export const tenantStore = {
    get(id: string) {
        return store.get(id) ?? null;
    },

    getAll() {
        return Array.from(store.values());
    },

    save(t: Tenant) {
        store.set(t.tenantId, t);
    },
};
