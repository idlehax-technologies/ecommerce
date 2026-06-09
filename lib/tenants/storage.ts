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
            address: "Newtown, AA-IIB",
            state: "West Bengal",
            gstin: undefined,
            status: "ACTIVE",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            tenantId: "tenant_mnsnhs",
            name: "Michaelnagar Shikshaniketan",
            address: "Michaelnagar, Airport",
            state: "West Bengal",
            gstin: "GST987654321",
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
    get(id: string): Tenant | null {
        const tenant = store.get(id);

        return tenant
            ? { ...tenant }
            : null;
    },

    getAll(): Tenant[] {
        return Array
            .from(store.values())
            .map((t) => ({ ...t }));
    },

    save(t: Tenant): void {
        store.set(t.tenantId, { ...t });
    },
};
