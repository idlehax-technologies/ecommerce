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

    const seed: Tenant[] = [
        {
            tenantId: "tenant_alpha",
            name: "Alpha School",
            status: "ACTIVE",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            tenantId: "tenant_mnsnhs",
            name: "Michaelnagar Shikshaniketan",
            status: "ACTIVE",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    for (const t of seed) {
        store.set(t.tenantId, t);
    }
}

seedTenants();

export const tenantStore = {
    get(id: string) {
        const tenant = store.get(id);

        return tenant
            ? { ...tenant }
            : null;
    },

    getAll() {
        return Array
            .from(store.values())
            .map((t) => ({ ...t }));
    },

    save(t: Tenant) {
        store.set(t.tenantId, { ...t });
    },
};
