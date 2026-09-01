import { beforeEach } from "vitest";

declare global {
    var __ordersById: Map<string, unknown>;
    var __ordersByTenant: Map<string, unknown>;
    var __paymentsById: Map<string, unknown>;
    var __paymentsByOrder: Map<string, unknown>;
    var __membershipStore: unknown | undefined;
    var __tenantInventoryStore: Map<string, unknown>;
    var __jobStore: Map<string, unknown>;
    var __productStore: Map<string, unknown>;
}

beforeEach(() => {
    // orders
    globalThis.__ordersById = new Map();
    globalThis.__ordersByTenant = new Map();

    // payments
    globalThis.__paymentsById = new Map();
    globalThis.__paymentsByOrder = new Map();

    // memberships
    globalThis.__membershipStore = undefined;

    // inventory
    globalThis.__tenantInventoryStore = new Map();

    // jobs
    globalThis.__jobStore = new Map();

    // products
    globalThis.__productStore = new Map();
});