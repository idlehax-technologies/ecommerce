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

import { getTenant } from "../tenants/domain";
import { getActiveProduct } from "@/lib/products/domain";

import type {
    TenantInventory,
    ProvisionProductDTO,
} from "@/types/tenantInventory";

function assertValidQuantity(
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

    await getTenant(tenantId);

    await getActiveProduct(dto.productId);

    const existing = await tenantInventoryStore.get(tenantId, dto.productId);

    if (!existing) {
        const created = toNewProvision(tenantId, dto);
        await tenantInventoryStore.save(created);
        return created;
    }

    const updated = applyProvisionPatch(existing, dto);

    // NEW INVARIANT
    if (existing.enabled && !dto.enabled && existing.reserved > 0) {
        throw new CannotDisableWithActiveReservationsError(dto.productId);
    }

    await tenantInventoryStore.save(updated);
    return updated;
}

export async function listTenantInventory(
    tenantId: string,
    limit?: number
): Promise<TenantInventory[]> {

    await getTenant(tenantId);

    const all = await tenantInventoryStore.listByTenant(tenantId);

    return limit ? all.slice(0, limit) : all;
}

export async function findTenantProvision(
    tenantId: string,
    productId: string
): Promise<TenantInventory | null> {

    await getTenant(tenantId);

    const inventory = await tenantInventoryStore.get(tenantId, productId);

    return inventory ?? null;
}

/**
 * Step 4: Reserve stock during checkout
 */
export async function reserveStock(
    tenantId: string,
    productId: string,
    quantity: number
): Promise<TenantInventory> {

    await getTenant(tenantId);

    assertValidQuantity(quantity);

    const updated = await tenantInventoryStore.update(
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

    await getTenant(tenantId);

    assertValidQuantity(quantity);

    const updated = await tenantInventoryStore.update(
        tenantId,
        productId,
        (record) => commitReservation(record, quantity)
    );

    requireProvision(updated, productId);

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

    await getTenant(tenantId);

    assertValidQuantity(quantity);

    const updated = await tenantInventoryStore.update(
        tenantId,
        productId,
        (record) => releaseReservation(record, quantity)
    );

    requireProvision(updated, productId);

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

    await tenantInventoryStore.save(corrected);

    return corrected;
}