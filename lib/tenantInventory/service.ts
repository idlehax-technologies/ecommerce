import { listProducts } from "@/lib/products/domain";
import { listTenantInventory } from "./domain";

import {
    toTenantProvisioningRow,
    TenantProvisioningRow,
} from "@/lib/mappers/tenantProvisioningView";

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
    tenantId: string,
    limit?: number
): Promise<TenantProvisioningRow[]> {

    const [products, tenantInventory] = await Promise.all([
        listProducts(),
        listTenantInventory(tenantId, limit),
    ]);

    const byProduct = new Map(
        tenantInventory.map((r) => [r.productId, r])
    );

    const rows: TenantProvisioningRow[] = products.map((p) =>
        toTenantProvisioningRow(
            p,
            byProduct.get(p.productId)
        )
    );

    return rows;
}