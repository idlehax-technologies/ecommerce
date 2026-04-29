import { tenantInventoryStore } from "./storage";
import { requireProvision } from "./guards";

import {
    isInventoryProcessed,
    markInventoryProcessed
} from "./idempotency";

import type { StockAdjustmentRequest } from "@/types/stockAdjustment";
import type { DomainEvent } from "@/types/domainEvent";

import {
    InvalidInventoryInputError,
    InventoryInvariantViolationError,
    TenantInventoryError
} from "./errors";

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

export function adjustStock(input: {
    tenantId: string;
    actorId: string; // kept for signature consistency, NOT used here
    request: StockAdjustmentRequest;
}): {
    updated: {
        productId: string;
        stock: number;
        reserved: number;
    };
    event?: DomainEvent;
} {

    const { tenantId, request } = input;

    // ------------------------------
    // VALIDATION
    // ------------------------------

    if (!request.idempotencyKey) {
        throw new InvalidInventoryInputError("idempotencyKey required");
    }

    if (isInventoryProcessed(request.idempotencyKey)) {
        const existing = tenantInventoryStore.get(tenantId, request.productId);

        requireProvision(existing, request.productId);

        return {
            updated: {
                productId: existing.productId,
                stock: existing.stock,
                reserved: existing.reserved
            },
            event: undefined
        };
    }

    if (request.newStock === undefined || request.newStock === null) {
        throw new InvalidInventoryInputError("newStock is required");
    }

    if (typeof request.newStock !== "number" || Number.isNaN(request.newStock)) {
        throw new InvalidInventoryInputError("newStock must be a valid number");
    }

    if (request.newStock < 0) {
        throw new InvalidInventoryInputError("stock cannot be negative");
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

            if (request.newStock < record.reserved) {
                throw new TenantInventoryError(
                    "stock cannot be less than reserved"
                );
            }

            before = {
                stock: record.stock,
                reserved: record.reserved
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
        reserved: updated.reserved
    };

    // ------------------------------
    // IDEMPOTENCY MARK
    // ------------------------------

    markInventoryProcessed(request.idempotencyKey);

    // ------------------------------
    // EVENT (CRITICAL FOR STEP 14)
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
            reserved: updated.reserved
        },
        event
    };
}