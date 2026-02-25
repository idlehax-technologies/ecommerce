// lib/tenantInventory/domain.ts

import { tenantInventoryStore } from "./storage";
import { toNewProvision, applyProvisionPatch } from "./mappers";
import { requireProvision } from "./guards";
import {
    ProvisionConflictError,
} from "./errors";

import { getProduct } from "@/lib/products/domain";
import type {
    TenantInventory,
    ProvisionProductDTO,
} from "@/types/tenantInventory";

/**
 * Provision (create or update) a tenant-product relationship.
 * This does NOT mutate Product.
 * It only controls tenant participation.
 */
export async function provisionProduct(
    tenantId: string,
    dto: ProvisionProductDTO
): Promise<TenantInventory> {
    // Ensure product actually exists globally
    await getProduct(dto.productId);

    const existing = tenantInventoryStore.get(tenantId, dto.productId);

    if (!existing) {
        const created = toNewProvision(tenantId, dto);
        tenantInventoryStore.save(created);
        return created;
    }

    const updated = applyProvisionPatch(existing, dto);
    tenantInventoryStore.save(updated);
    return updated;
}

/**
 * Remove provisioning (tenant can no longer sell product)
 */
export function deprovisionProduct(
    tenantId: string,
    productId: string
): void {
    const existing = tenantInventoryStore.get(tenantId, productId);
    requireProvision(existing, productId);

    tenantInventoryStore.delete(tenantId, productId);
}

/**
 * Read tenant inventory only (no join)
 */
export function listTenantInventory(
    tenantId: string
): TenantInventory[] {
    return tenantInventoryStore.listByTenant(tenantId);
}