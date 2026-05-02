import { beforeEach } from "vitest";

beforeEach(() => {
    // orders
    (globalThis as any).__ordersById = new Map();
    (globalThis as any).__ordersByTenant = new Map();

    // payments
    (globalThis as any).__paymentsById = new Map();
    (globalThis as any).__paymentsByOrder = new Map();

    // memberships
    (globalThis as any).__membershipStore = undefined;

    // inventory
    (globalThis as any).__tenantInventoryStore = new Map();

    // jobs
    (globalThis as any).__jobStore = new Map();

    // ✅ FIX: products (missing earlier)
    (globalThis as any).__productStore = new Map();
});