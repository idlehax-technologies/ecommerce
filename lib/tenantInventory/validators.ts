import type {
    ProvisionProductDTO,
} from "@/types/tenantInventory";

import {
    InvalidInventoryInputError,
} from "./errors";

import {
    StockAdjustmentRequest,
} from "@/types/stockAdjustment";

function isNonEmptyString(
    value: unknown
): value is string {
    return (
        typeof value === "string" &&
        value.trim().length > 0
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

    if (
        typeof obj.stock !== "number" ||
        !Number.isFinite(obj.stock) ||
        obj.stock < 0
    ) {
        throw new InvalidInventoryInputError(
            "stock must be a non-negative number"
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

    if (
        typeof obj.newStock !== "number" ||
        !Number.isFinite(obj.newStock)
    ) {
        throw new InvalidInventoryInputError(
            "newStock must be a valid number"
        );
    }

    if (obj.newStock < 0) {
        throw new InvalidInventoryInputError(
            "stock cannot be negative"
        );
    }
}