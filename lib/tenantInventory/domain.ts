import { tenantInventoryStore } from "./storage";
import { toNewProvision, applyProvisionPatch } from "./mappers";
import { requireProvision } from "./guards";
import {
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
    tenantInventoryStore.save(updated);

    return updated;
}

export function deprovisionProduct(
    tenantId: string,
    productId: string
): void {

    const existing = tenantInventoryStore.get(tenantId, productId);

    requireProvision(existing, productId);

    tenantInventoryStore.delete(tenantId, productId);
}

export function listTenantInventory(
    tenantId: string
): TenantInventory[] {

    return tenantInventoryStore.listByTenant(tenantId);
}

export function findTenantProvision(
    tenantId: string,
    productId: string
): TenantInventory | null {

    return tenantInventoryStore.get(tenantId, productId) ?? null;
}

/**
 * Step 4: Reserve stock during checkout
 */
export function reserveStock(
    tenantId: string,
    productId: string,
    quantity: number
): TenantInventory {

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
export function commitStock(
    tenantId: string,
    productId: string,
    quantity: number
): TenantInventory {

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
export function releaseStock(
    tenantId: string,
    productId: string,
    quantity: number
): TenantInventory {

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