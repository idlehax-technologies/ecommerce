import { describe, it, expect } from "vitest";

import * as inventory from "@/lib/tenantInventory/domain";
import * as products from "@/lib/products/domain";

describe("Inventory — Tenant Isolation", () => {
    it("should not leak inventory across tenants", async () => {
        const product = await products.createProduct({
            title: "Test Product",
            price: 10,
        });

        await inventory.provisionProduct("tenant_alpha", {
            productId: product.productId,
            enabled: true,
            stock: 10,
        });

        const list = inventory.listTenantInventory("tenant_mnsnhs");

        expect(list.length).toBe(0);
    });
});