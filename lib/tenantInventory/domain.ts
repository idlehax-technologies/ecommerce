// lib/tenantInventory/domain.ts

import { tenantInventoryStore } from "./storage";
import { toNewProvision, applyProvisionPatch } from "./mappers";
import { requireProvision } from "./guards";
import { ProvisionNotFoundError } from "./errors";

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

    // Ensure product exists globally
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


/**
 * Find a single tenant-product provisioning record
 */
export function findTenantProvision(
    tenantId: string,
    productId: string
): TenantInventory | null {

    return tenantInventoryStore.get(tenantId, productId) ?? null;
}


/**
 * Checkout operation:
 * Reserve stock during order creation.
 *
 * This enforces the invariant:
 *   stock cannot go negative
 */
export function reserveStock(
    tenantId: string,
    productId: string,
    quantity: number
): TenantInventory {

    const provision = tenantInventoryStore.get(tenantId, productId);

    requireProvision(provision, productId);

    if (!provision.enabled) {
        throw new ProvisionNotFoundError(productId);
    }

    if (provision.stock < quantity) {
        throw new ProvisionNotFoundError(productId);
    }

    const updated: TenantInventory = {
        ...provision,
        stock: provision.stock - quantity,
        updatedAt: new Date().toISOString(),
    };

    tenantInventoryStore.save(updated);

    return updated;
}