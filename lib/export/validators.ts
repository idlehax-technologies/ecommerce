import { ExportInvalidInputError } from "./errors";

import type { ExportRequest } from "@/types/export";

function isNonEmptyString(
    value: unknown
): value is string {
    return (
        typeof value === "string" &&
        value.trim().length > 0
    );
}

function isPositiveInteger(
    value: unknown
): value is number {
    return (
        typeof value === "number" &&
        Number.isInteger(value) &&
        value > 0
    );
}

export function validateExportRequest(
    body: unknown
): asserts body is ExportRequest {

    if (
        typeof body !== "object" ||
        body === null
    ) {
        throw new ExportInvalidInputError(
            "Invalid request body"
        );
    }

    const obj = body as Record<string, unknown>;

    if (
        obj.type !== "ORDERS" &&
        obj.type !== "RECONCILIATION"
    ) {
        throw new ExportInvalidInputError(
            "Invalid export type"
        );
    }

    if (
        "cursor" in obj &&
        obj.cursor !== undefined &&
        !isNonEmptyString(obj.cursor)
    ) {
        throw new ExportInvalidInputError(
            "Cursor must be a non-empty string"
        );
    }

    if (
        "limit" in obj &&
        obj.limit !== undefined &&
        !isPositiveInteger(obj.limit)
    ) {
        throw new ExportInvalidInputError(
            "Limit must be a positive integer"
        );
    }
}