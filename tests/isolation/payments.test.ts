import { describe, it, expect } from "vitest";
import * as orders from "@/lib/orders/domain";
import * as payments from "@/lib/payments/domain";

describe("Payments — Tenant Isolation", () => {

    it("should not confirm payment across tenants", () => {
        const { order } = orders.createOrder(
            "tenant_alpha",
            "u_customer",
            [{ productId: "p1", name: "A", price: 10, quantity: 1 }]
        );

        payments.recordPayment("tenant_alpha", order.orderId, "CASH");

        expect(() =>
            payments.confirmPayment("tenant_mnsnhs", order.orderId)
        ).toThrow();
    });

});