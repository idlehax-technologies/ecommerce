// lib/tenantInventory/validators.ts

import type { ProvisionProductDTO } from "@/types/tenantInventory";
import { InvalidInventoryInputError } from "./errors";

export function validateProvisionInput(
    body: unknown
): asserts body is ProvisionProductDTO {
    if (typeof body !== "object" || body === null) {
        throw new InvalidInventoryInputError();
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