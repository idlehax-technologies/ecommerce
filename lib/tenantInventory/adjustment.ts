import { tenantInventoryStore } from "./storage";
import { requireProvision } from "./guards";
import { recordAuditLog } from "@/lib/audit/domain";

import {
    isInventoryProcessed,
    markInventoryProcessed
} from "./idempotency";

import type { StockAdjustmentRequest } from "@/types/stockAdjustment";
import { InvalidInventoryInputError, InventoryInvariantViolationError, TenantInventoryError } from "./errors";

export function adjustStock(input: {
    tenantId: string;
    actorId: string;
    request: StockAdjustmentRequest;
}) {

    const { tenantId, actorId, request } = input;

    if (!request.idempotencyKey) {
        throw new InvalidInventoryInputError("idempotencyKey required");
    }

    if (isInventoryProcessed(request.idempotencyKey)) {
        return;
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

    let previousStock: number | null = null;

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

            previousStock = record.stock;

            return {
                ...record,
                stock: request.newStock,
                updatedAt: new Date().toISOString(),
            };
        }
    );

    if (previousStock === null) {
        throw new InventoryInvariantViolationError(
            "previousStock not captured during update"
        );
    }

    recordAuditLog({
        tenantId,
        actorId,
        action: "ADJUST_STOCK",
        entityType: "PRODUCT",
        entityId: request.productId,
        metadata: {
            previousStock,
            newStock: updated.stock,
            reserved: updated.reserved,
            reason: request.reason,
        },
    });

    markInventoryProcessed(request.idempotencyKey);

    return updated;
}