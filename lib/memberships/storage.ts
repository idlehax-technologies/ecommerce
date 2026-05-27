import type { Membership } from "@/types/membership";

const globalStore = globalThis as any;

const store: Map<string, Membership> =
    globalStore.__membershipStore ?? new Map();

globalStore.__membershipStore = store;

function seedMemberships() {
    if (store.size > 0) return;

    const now = new Date().toISOString();

    const seed: Membership[] = [
        // tenant_alpha
        {
            membershipId: "m_u_customer_alpha",
            userId: "u_customer",
            tenantId: "tenant_alpha",
            role: "customer",
            status: "APPROVED",
            createdAt: now,
            updatedAt: now,
        },
        {
            membershipId: "m_u_staff_alpha",
            userId: "u_staff",
            tenantId: "tenant_alpha",
            role: "staff",
            status: "APPROVED",
            createdAt: now,
            updatedAt: now,
        },
        {
            membershipId: "m_u_admin_alpha",
            userId: "u_admin",
            tenantId: "tenant_alpha",
            role: "admin",
            status: "APPROVED",
            createdAt: now,
            updatedAt: now,
        },

        // tenant_mnsnhs
        {
            membershipId: "m_mnsnhs_customer",
            userId: "mnsnhs_customer",
            tenantId: "tenant_mnsnhs",
            role: "customer",
            status: "APPROVED",
            createdAt: now,
            updatedAt: now,
        },
        {
            membershipId: "m_mnsnhs_staff",
            userId: "mnsnhs_staff",
            tenantId: "tenant_mnsnhs",
            role: "staff",
            status: "APPROVED",
            createdAt: now,
            updatedAt: now,
        },
        {
            membershipId: "m_mnsnhs_admin",
            userId: "mnsnhs_admin",
            tenantId: "tenant_mnsnhs",
            role: "admin",
            status: "APPROVED",
            createdAt: now,
            updatedAt: now,
        },
    ];

    for (const m of seed) {
        store.set(m.membershipId, m);
    }
}

seedMemberships();

export const membershipStore = {
    get(id: string): Membership | null {
        return store.get(id) ?? null;
    },

    getAll(): Membership[] {
        return Array.from(store.values());
    },

    listByUser(userId: string): Membership[] {
        return Array.from(store.values()).filter(
            (m) => m.userId === userId
        );
    },

    listByTenant(tenantId: string): Membership[] {
        return Array.from(store.values()).filter(
            (m) => m.tenantId === tenantId
        );
    },

    save(m: Membership): void {
        store.set(m.membershipId, m);
    },
};
