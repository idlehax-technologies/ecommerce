import type { ProvisionProductDTO } from "@/types/tenantInventory";
import { InvalidInventoryInputError } from "./errors";
import { StockAdjustmentRequest } from "@/types/stockAdjustment";

export function validateProvisionInput(
    body: unknown
): asserts body is ProvisionProductDTO {
    if (typeof body !== "object" || body === null) {
        throw new InvalidInventoryInputError("Invalid request body");
    }

    const dto = body as ProvisionProductDTO;

    if (typeof dto.productId !== "string" || dto.productId.length === 0) {
        throw new InvalidInventoryInputError("productId is required");
    }

    if (typeof dto.enabled !== "boolean") {
        throw new InvalidInventoryInputError("enabled must be boolean");
    }

    if (
        typeof dto.stock !== "number" ||
        !Number.isFinite(dto.stock) ||
        dto.stock < 0
    ) {
        throw new InvalidInventoryInputError("stock must be a non-negative number");
    }
}

export function validateStockAdjustmentInput(
    body: unknown
): asserts body is StockAdjustmentRequest {
    if (!body || typeof body !== "object") {
        throw new InvalidInventoryInputError("Invalid request body");
    }

    const obj = body as Record<string, unknown>;

    if (typeof obj.idempotencyKey !== "string" || obj.idempotencyKey.length === 0) {
        throw new InvalidInventoryInputError("idempotencyKey is required");
    }

    if (typeof obj.productId !== "string" || obj.productId.length === 0) {
        throw new InvalidInventoryInputError("productId is required");
    }

    if (
        typeof obj.newStock !== "number" ||
        !Number.isFinite(obj.newStock)
    ) {
        throw new InvalidInventoryInputError("newStock must be a valid number");
    }

    if (obj.newStock < 0) {
        throw new InvalidInventoryInputError("stock cannot be negative");
    }
}