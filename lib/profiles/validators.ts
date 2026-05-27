import type { ProfileDTO } from "@/types/profile";

import { ProfileInvalidInputError } from "./errors";

function isNonEmptyString(
    value: unknown
): value is string {
    return (
        typeof value === "string" &&
        value.trim().length > 0
    );
}

export function assertProfileInput(
    body: unknown
): asserts body is ProfileDTO {
    if (!body || typeof body !== "object") {
        throw new ProfileInvalidInputError(
            "Invalid request body"
        );
    }

    const b = body as Record<string, unknown>;

    if (!isNonEmptyString(b.fullName)) {
        throw new ProfileInvalidInputError(
            "Full name must be a non-empty string"
        );
    }

    if (!isNonEmptyString(b.email)) {
        throw new ProfileInvalidInputError(
            "Email must be a non-empty string"
        );
    }

    if (!isNonEmptyString(b.addressText)) {
        throw new ProfileInvalidInputError(
            "Address must be a non-empty string"
        );
    }
}