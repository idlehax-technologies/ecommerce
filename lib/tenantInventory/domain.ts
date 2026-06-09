import { tenantInventoryStore } from "./storage";
import { toNewProvision, applyProvisionPatch } from "./mappers";
import { requireProvision } from "./guards";
import {
    CannotDisableWithActiveReservationsError,
    InvalidQuantityError,
    InventoryInvariantViolationError,
    ProvisionNotFoundError,
} from "./errors";

import {
    applyReservation,
    commitReservation,
    releaseReservation
} from "./reservations";

import { getActiveProduct } from "@/lib/products/domain";

import type {
    TenantInventory,
    ProvisionProductDTO,
} from "@/types/tenantInventory";

export function assertValidQuantity(
    quantity: unknown
): asserts quantity is number {

    if (
        typeof quantity !== "number" ||
        !Number.isFinite(quantity)
    ) {
        throw new InvalidQuantityError(
            "Quantity must be a valid number"
        );
    }

    if (quantity <= 0) {
        throw new InvalidQuantityError(
            "Quantity must be a positive number"
        );
    }
}

export async function provisionProduct(
    tenantId: string,
    dto: ProvisionProductDTO
): Promise<TenantInventory> {

    await getActiveProduct(dto.productId);

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

    assertValidQuantity(quantity);

    const updated = tenantInventoryStore.update(
        tenantId,
        productId,
        (record) => {

            if (!record.enabled) {
                throw new ProvisionNotFoundError(productId);
            }

            return applyReservation(record, quantity);
        }
    );

    requireProvision(updated, productId);

    return updated;
}

/**
 * Commit reservation when order becomes PAID
 */
export async function commitStock(
    tenantId: string,
    productId: string,
    quantity: number
): Promise<TenantInventory> {

    assertValidQuantity(quantity);

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

    assertValidQuantity(quantity);

    const record = tenantInventoryStore.get(tenantId, productId);

    requireProvision(record, productId);

    const updated = releaseReservation(record, quantity);

    tenantInventoryStore.save(updated);

    return updated;
}

export async function reconcileReservedQuantity(
    record: TenantInventory,
    expectedReserved: number
): Promise<TenantInventory> {

    if (record.stock < expectedReserved) {
        throw new InventoryInvariantViolationError(
            "stock cannot be less than reserved"
        );
    }

    const corrected: TenantInventory = {
        ...record,
        reserved: expectedReserved,
        updatedAt: new Date().toISOString(),
    };

    tenantInventoryStore.save(corrected);

    return corrected;
}