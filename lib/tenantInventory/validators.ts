// lib/tenantInventory/validators.ts

import type { ProvisionProductDTO } from "@/types/tenantInventory";
import { InvalidProvisionInputError } from "./errors";

export function validateProvisionInput(
    body: unknown
): asserts body is ProvisionProductDTO {
    if (typeof body !== "object" || body === null) {
        throw new InvalidProvisionInputError();
    }

    const dto = body as ProvisionProductDTO;

    if (typeof dto.productId !== "string" || dto.productId.length === 0) {
        throw new InvalidProvisionInputError("productId is required");
    }

    if (typeof dto.enabled !== "boolean") {
        throw new InvalidProvisionInputError("enabled must be boolean");
    }

    if (
        typeof dto.stock !== "number" ||
        !Number.isFinite(dto.stock) ||
        dto.stock < 0
    ) {
        throw new InvalidProvisionInputError("stock must be a non-negative number");
    }
}