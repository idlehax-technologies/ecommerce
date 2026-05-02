import { describe, it, expect } from "vitest";
import * as orders from "@/lib/orders/domain";

describe("Orders — Tenant Isolation", () => {

    it("should not allow cross-tenant read", () => {
        const { order } = orders.createOrder(
            "tenant_alpha",
            "u_customer",
            [{ productId: "p1", name: "A", price: 10, quantity: 1 }]
        );

        expect(() =>
            orders.getTenantOrder("tenant_mnsnhs", order.orderId)
        ).toThrow();
    });

    it("should not allow cross-tenant mutation", () => {
        const { order } = orders.createOrder(
            "tenant_alpha",
            "u_customer",
            [{ productId: "p1", name: "A", price: 10, quantity: 1 }]
        );

        expect(() =>
            orders.cancelOrder("tenant_mnsnhs", order.orderId)
        ).toThrow();
    });

});