import { getTenant } from "@/lib/tenants/domain";
import {
    listActiveProducts,
    listProducts,
} from "@/lib/products/domain";
import { listTenantInventory } from "./domain";

import {
    TenantProvisioningRow,
    toTenantProvisioningRow,
} from "@/lib/mappers/tenantProvisioningView";
import {
    TenantProductRow,
    toTenantProductRow
} from "@/lib/mappers/tenantProductView";

import type { Product } from "@/types/product";

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
export async function getTenantInventoryView(
    tenantId: string,
    limit?: number
): Promise<TenantProvisioningRow[]> {

    await getTenant(tenantId);

    const [products, tenantInventory] = await Promise.all([
        listActiveProducts(),
        listTenantInventory(tenantId, limit),
    ]);

    const byProduct = new Map(
        tenantInventory.map((i) => [i.productId, i])
    );

    const rows: TenantProvisioningRow[] = products.map((p) =>
        toTenantProvisioningRow(
            p,
            byProduct.get(p.productId)
        )
    );

    return rows;
}

export async function getTenantProductView(
    tenantId: string
): Promise<TenantProductRow[]> {

    await getTenant(tenantId);

    const [products, tenantInventory] = await Promise.all([
        listActiveProducts(),
        listTenantInventory(tenantId),
    ]);

    const byProduct = new Map(
        tenantInventory.map((inventory) => [
            inventory.productId,
            inventory,
        ])
    );

    const rows: TenantProductRow[] =
        products.flatMap((product) => {

            const inventory =
                byProduct.get(product.productId);

            if (!inventory) {
                return [];
            }

            if (!inventory.enabled) {
                return [];
            }

            return [
                toTenantProductRow(product, inventory),
            ];
        });

    return rows;
}

export async function listTenantProducts(
    tenantId: string
): Promise<Product[]> {

    await getTenant(tenantId);

    const [products, tenantInventory] = await Promise.all([
        listProducts(),
        listTenantInventory(tenantId),
    ]);

    const enabledProductIds = new Set(
        tenantInventory
            .filter(inventory => inventory.enabled)
            .map(inventory => inventory.productId)
    );

    const rows = products.filter(product =>
        enabledProductIds.has(product.productId)
    );

    return rows;
}