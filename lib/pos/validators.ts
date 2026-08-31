import { CreatePOSOrderDTO } from "@/types/pos";
import { InvalidOrderItemQuantityError } from "@/lib/orders/errors";

export function assertCreatePOSOrderDTO(
    body: unknown
): asserts body is CreatePOSOrderDTO {
    if (
        typeof body !== "object" ||
        body === null
    ) {
        throw new Error("Invalid POS payload");
    }

    const obj = body as Record<string, unknown>;

    if (!Array.isArray(obj.items)) {
        throw new Error("Items must be an array");
    }

    for (const item of obj.items) {
        if (
            typeof item !== "object" ||
            item === null
        ) {
            throw new Error("Invalid POS item");
        }

        const row = item as Record<string, unknown>;

        if (
            typeof row.productId !== "string"
        ) {
            throw new Error("Invalid product ID");
        }

        if (
            typeof row.quantity !== "number"
        ) {
            throw new InvalidOrderItemQuantityError();
        }

        if (row.quantity <= 0) {
            throw new InvalidOrderItemQuantityError();
        }
    }
}