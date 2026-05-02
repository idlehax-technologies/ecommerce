import { describe, it, expect } from "vitest";
import * as orders from "@/lib/orders/domain";
import { execute } from "@/lib/jobs/execute";
import type { Job } from "@/types/job";

describe("Jobs — Tenant Isolation", () => {
    it("should not expire order from wrong tenant", async () => {
        const { order } = orders.createOrder(
            "tenant_alpha",
            "u_customer",
            [{ productId: "p1", name: "A", price: 10, quantity: 1 }]
        );

        const job: Job = {
            jobId: "j1",
            type: "ORDER_EXPIRY",
            payload: {
                tenantId: "tenant_mnsnhs",
                orderId: order.orderId,
            },
            status: "PENDING",
            attempts: 0,
            runAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
        };

        await expect(() => execute(job)).rejects.toThrow();
    });
});