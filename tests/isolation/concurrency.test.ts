import { describe, it, expect } from "vitest";
import * as orders from "@/lib/orders/domain";

describe("Concurrency — Isolation", () => {
    it("parallel tenant operations must not interfere", async () => {
        const [o1, o2] = await Promise.all([
            (async () =>
                orders.createOrder("tenant_alpha", "u_customer", [
                    { productId: "p1", name: "A", price: 10, quantity: 1 }
                ])
            )(),
            (async () =>
                orders.createOrder("tenant_mnsnhs", "mnsnhs_customer", [
                    { productId: "p2", name: "B", price: 20, quantity: 1 }
                ])
            )(),
        ]);

        expect(o1.order.tenantId).not.toBe(o2.order.tenantId);
    });
});