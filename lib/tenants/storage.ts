import { Tenant } from "@/types/tenant";

const store = new Map<string, Tenant>();

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
