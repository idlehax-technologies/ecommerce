import type { ExportRequest } from "@/types/export";

import {
    ExportInvalidInputError,
} from "./errors";

function isNonEmptyString(
    value: unknown
): value is string {
    return (
        typeof value === "string" &&
        value.trim().length > 0
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
        typeof obj.limit !== "number"
    ) {
        throw new ExportInvalidInputError(
            "Limit must be a number"
        );
    }
}