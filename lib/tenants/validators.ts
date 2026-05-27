import { CreateTenantDTO } from "@/types/tenant";
import { TenantInvalidInputError } from "./errors";

function isNonEmptyString(
    value: unknown
): value is string {
    return (
        typeof value === "string" &&
        value.trim().length > 0
    );
}

export function assertCreateTenantDTO(
    body: unknown
): asserts body is CreateTenantDTO {

    if (
        !body ||
        typeof body !== "object"
    ) {
        throw new TenantInvalidInputError(
            "Invalid request body"
        );
    }

    const obj = body as Record<string, unknown>;

    if (!isNonEmptyString(obj.name)) {
        throw new TenantInvalidInputError(
            "Name must be a non-empty string"
        );
    }
}