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

export async function adjustStockBy(input: {
    tenantId: string;
    actorId: string; // Reserved for future audit/observability
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

            const newStock = record.stock + request.delta;

            if (newStock < record.reserved) {
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
                stock: newStock,
                updatedAt: new Date().toISOString(),
            };
        }
    );

    requireProvision(updated, request.productId);

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