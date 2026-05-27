import { tenantInventoryStore } from "./storage";
import { toNewProvision, applyProvisionPatch } from "./mappers";
import { requireProvision } from "./guards";
import {
    CannotDisableWithActiveReservationsError,
    InvalidQuantityError,
    ProvisionNotFoundError,
} from "./errors";

import {
    applyReservation,
    commitReservation,
    releaseReservation
} from "./reservations";

import { getProduct } from "@/lib/products/domain";

import type {
    TenantInventory,
    ProvisionProductDTO,
} from "@/types/tenantInventory";

export async function provisionProduct(
    tenantId: string,
    dto: ProvisionProductDTO
): Promise<TenantInventory> {

    await getProduct(dto.productId);

    const existing = tenantInventoryStore.get(tenantId, dto.productId);

    if (!existing) {
        const created = toNewProvision(tenantId, dto);
        tenantInventoryStore.save(created);
        return created;
    }

    const updated = applyProvisionPatch(existing, dto);

    // NEW INVARIANT
    if (existing.enabled && !dto.enabled && existing.reserved > 0) {
        throw new CannotDisableWithActiveReservationsError(dto.productId);
    }

    tenantInventoryStore.save(updated);
    return updated;
}

export async function listTenantInventory(
    tenantId: string,
    limit?: number
): Promise<TenantInventory[]> {

    const all = tenantInventoryStore.listByTenant(tenantId);

    return limit ? all.slice(0, limit) : all;
}

export async function findTenantProvision(
    tenantId: string,
    productId: string
): Promise<TenantInventory | null> {

    return tenantInventoryStore.get(tenantId, productId) ?? null;
}

/**
 * Step 4: Reserve stock during checkout
 */
export async function reserveStock(
    tenantId: string,
    productId: string,
    quantity: number
): Promise<TenantInventory> {

    if (typeof quantity !== "number" || Number.isNaN(quantity)) {
        throw new InvalidQuantityError("quantity must be a valid number");
    }

    if (quantity <= 0) {
        throw new InvalidQuantityError("quantity must be greater than 0");
    }

    return tenantInventoryStore.update(
        tenantId,
        productId,
        (record) => {

            requireProvision(record, productId);

            if (!record.enabled) {
                throw new ProvisionNotFoundError(productId);
            }

            return applyReservation(record, quantity);
        }
    );
}

/**
 * Commit reservation when order becomes PAID
 */
export async function commitStock(
    tenantId: string,
    productId: string,
    quantity: number
): Promise<TenantInventory> {

    if (typeof quantity !== "number" || Number.isNaN(quantity)) {
        throw new InvalidQuantityError("quantity must be a valid number");
    }

    if (quantity <= 0) {
        throw new InvalidQuantityError("quantity must be greater than 0");
    }

    const record = tenantInventoryStore.get(tenantId, productId);

    requireProvision(record, productId);

    const updated = commitReservation(record, quantity);

    tenantInventoryStore.save(updated);

    return updated;
}

/**
 * Release reservation when order expires or is cancelled
 */
export async function releaseStock(
    tenantId: string,
    productId: string,
    quantity: number
): Promise<TenantInventory> {

    if (typeof quantity !== "number" || Number.isNaN(quantity)) {
        throw new InvalidQuantityError("quantity must be a valid number");
    }

    if (quantity <= 0) {
        throw new InvalidQuantityError("quantity must be greater than 0");
    }

    const record = tenantInventoryStore.get(tenantId, productId);

    requireProvision(record, productId);

    const updated = releaseReservation(record, quantity);

    tenantInventoryStore.save(updated);

    return updated;
}