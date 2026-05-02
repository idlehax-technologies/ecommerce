import { describe, it, expect } from "vitest";
import { runTenantReconciliation } from "@/lib/reconciliation/domain";
import * as orders from "@/lib/orders/domain";

describe("Reconciliation — Isolation", () => {

    it("should not mix tenant data", () => {
        orders.createOrder(
            "tenant_alpha",
            "u_customer",
            [{ productId: "p1", name: "A", price: 10, quantity: 1 }]
        );

        const report = runTenantReconciliation("tenant_mnsnhs");

        expect(report.mismatches.length).toBe(0);
    });

});