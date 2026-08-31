import type {
    ProvisionProductDTO,
} from "@/types/tenantInventory";

import type {
    StockAdjustmentRequest,
} from "@/types/stockAdjustment";

import {
    InvalidInventoryInputError,
} from "./errors";

function isNonEmptyString(
    value: unknown
): value is string {
    return (
        typeof value === "string" &&
        value.trim().length > 0
    );
}

function isValidStockAdjustment(
    value: unknown
): value is number {
    return (
        typeof value === "number" &&
        Number.isFinite(value) &&
        value !== 0
    );
}

export function validateProvisionInput(
    body: unknown
): asserts body is ProvisionProductDTO {

    if (
        typeof body !== "object" ||
        body === null
    ) {
        throw new InvalidInventoryInputError(
            "Invalid request body"
        );
    }

    const obj = body as Record<string, unknown>;

    if (!isNonEmptyString(obj.productId)) {
        throw new InvalidInventoryInputError(
            "productId is required"
        );
    }

    if (typeof obj.enabled !== "boolean") {
        throw new InvalidInventoryInputError(
            "enabled must be boolean"
        );
    }
}

export function validateStockAdjustmentInput(
    body: unknown
): asserts body is StockAdjustmentRequest {

    if (
        !body ||
        typeof body !== "object"
    ) {
        throw new InvalidInventoryInputError(
            "Invalid request body"
        );
    }

    const obj = body as Record<string, unknown>;

    if (!isNonEmptyString(obj.idempotencyKey)) {
        throw new InvalidInventoryInputError(
            "idempotencyKey is required"
        );
    }

    if (!isNonEmptyString(obj.productId)) {
        throw new InvalidInventoryInputError(
            "productId is required"
        );
    }

    if (!isValidStockAdjustment(obj.delta)) {
        throw new InvalidInventoryInputError(
            "Delta must be a non-zero number"
        );
    }
}