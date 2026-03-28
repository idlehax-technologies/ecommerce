import { listProducts } from "@/lib/products/domain";
import { listTenantInventory } from "./domain";

import {
    toTenantProvisioningRow,
    TenantProvisioningRow,
} from "@/lib/mappers/tenantProvisioningView";

/**
 * Read-model returned to UI / routes.
 * This is NOT a domain entity.
 */
export type TenantProvisioningView = {
    rows: TenantProvisioningRow[];
};

/**
 * Application Use-Case:
 * Build the provisioning view for a tenant.
 *
 * Coordinates:
 *   - Global Product Catalog (platform truth)
 *   - TenantInventory allocations (tenant participation)
 *
 * Domain modules remain independent.
 * This layer composes them.
 */
export async function getTenantProvisioningView(
    tenantId: string
): Promise<TenantProvisioningView> {
    const [products, tenantInventory] = await Promise.all([
        listProducts(),
        Promise.resolve(listTenantInventory(tenantId)),
    ]);

    const byProduct = new Map(
        tenantInventory.map((r) => [r.productId, r])
    );

    const rows: TenantProvisioningRow[] = products.map((p) =>
        toTenantProvisioningRow(p, byProduct.get(p.productId))
    );

    return { rows };
}