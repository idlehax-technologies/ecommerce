import { tenantInventoryStore } from "./storage";
import { requireProvision } from "./guards";

import {
    isInventoryProcessed,
    markInventoryProcessed
} from "./idempotency";

import type { AdjustedInventorySnapshot, StockAdjustmentRequest } from "@/types/stockAdjustment";
import type { DomainEvent } from "@/types/domainEvent";

import { InventoryInvariantViolationError } from "./errors";

/**
 * STOCK ADJUSTMENT (DOMAIN)
 *
 * Responsibilities:
 * - validate input
 * - enforce invariants
 * - mutate inventory atomically
 * - ensure idempotency
 *
 * MUST NOT:
 * - write audit logs
 * - trigger side-effects
 *
 * MUST:
 * - return DomainEvent for dispatcher
 */

export async function adjustStock(input: {
    tenantId: string;
    actorId: string;    // Unused argument
    request: StockAdjustmentRequest;
}): Promise<{
    updated: AdjustedInventorySnapshot;
    event?: DomainEvent;
}> {
    const { tenantId, request } = input;

    // ------------------------------
    // IDEMPOTENCY
    // ------------------------------

    if (isInventoryProcessed(request.idempotencyKey)) {
        const existing = tenantInventoryStore.get(tenantId, request.productId);

        requireProvision(existing, request.productId);

        return {
            updated: {
                productId: existing.productId,
                stock: existing.stock,
                reserved: existing.reserved,
            },
            event: undefined,
        };
    }

    // ------------------------------
    // MUTATION
    // ------------------------------

    let before: { stock: number; reserved: number } | null = null;

    const updated = tenantInventoryStore.update(
        tenantId,
        request.productId,
        (record) => {
            requireProvision(record, request.productId);

            // invariant: stock >= reserved
            if (request.newStock < record.reserved) {
                throw new InventoryInvariantViolationError(
                    "stock cannot be less than reserved"
                );
            }

            before = {
                stock: record.stock,
                reserved: record.reserved,
            };

            return {
                ...record,
                stock: request.newStock,
                updatedAt: new Date().toISOString(),
            };
        }
    );

    if (before === null) {
        throw new InventoryInvariantViolationError(
            "previous state not captured during update"
        );
    }

    const after = {
        stock: updated.stock,
        reserved: updated.reserved,
    };

    // ------------------------------
    // IDEMPOTENCY MARK
    // ------------------------------

    markInventoryProcessed(request.idempotencyKey);

    // ------------------------------
    // EVENT
    // ------------------------------

    const event: DomainEvent = {
        type: "InventoryAdjusted",
        tenantId,
        productId: request.productId,
        from: before,
        to: after,
    };

    return {
        updated: {
            productId: request.productId,
            stock: updated.stock,
            reserved: updated.reserved,
        },
        event,
    };
}