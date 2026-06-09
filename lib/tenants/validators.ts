import type {
    CreateTenantDTO,
    UpdateTenantDTO,
} from "@/types/tenant";

import { TenantInvalidInputError } from "./errors";

import {
    INDIAN_STATES,
    type IndianState,
} from "./states";

function isObject(
    v: unknown
): v is Record<string, unknown> {
    return (
        typeof v === "object" &&
        v !== null
    );
}

function isNonEmptyString(
    value: unknown
): value is string {
    return (
        typeof value === "string" &&
        value.trim().length > 0
    );
}

export function isIndianState(
    value: unknown
): value is IndianState {
    return INDIAN_STATES.some(
        state => state.name === value
    );
}

function assertNoForbiddenFields(
    obj: Record<string, unknown>
) {
    const forbidden = [
        "tenantId",
        "status",
        "createdAt",
        "updatedAt",
    ];

    for (const key of forbidden) {
        if (key in obj) {
            throw new TenantInvalidInputError(
                `Field "${key}" is not allowed`
            );
        }
    }
}

export function validateCreateTenant(
    body: unknown
): asserts body is CreateTenantDTO {
    if (!isObject(body)) {
        throw new TenantInvalidInputError(
            "Invalid request body"
        );
    }

    assertNoForbiddenFields(body);

    if (!isNonEmptyString(body.name)) {
        throw new TenantInvalidInputError(
            "Name must be a non-empty string"
        );
    }

    if (!isNonEmptyString(body.address)) {
        throw new TenantInvalidInputError(
            "Address must be a non-empty string"
        );
    }

    if (!isIndianState(body.state)) {
        throw new TenantInvalidInputError(
            "State must be a valid Indian state"
        );
    }

    if (
        "gstin" in body &&
        body.gstin !== undefined &&
        typeof body.gstin !== "string"
    ) {
        throw new TenantInvalidInputError(
            "GSTIN must be a string"
        );
    }
}

export function validateUpdateTenant(
    body: unknown
): asserts body is UpdateTenantDTO {
    if (!isObject(body)) {
        throw new TenantInvalidInputError(
            "Invalid request body"
        );
    }

    assertNoForbiddenFields(body);

    if (Object.keys(body).length === 0) {
        throw new TenantInvalidInputError(
            "Update payload cannot be empty"
        );
    }

    if (
        "name" in body &&
        body.name !== undefined &&
        !isNonEmptyString(body.name)
    ) {
        throw new TenantInvalidInputError(
            "Name must be a non-empty string"
        );
    }

    if (
        "address" in body &&
        body.address !== undefined &&
        !isNonEmptyString(body.address)
    ) {
        throw new TenantInvalidInputError(
            "Address must be a non-empty string"
        );
    }

    if (
        "state" in body &&
        body.state !== undefined &&
        !isIndianState(body.state)
    ) {
        throw new TenantInvalidInputError(
            "State must be a valid Indian state"
        );
    }

    if (
        "gstin" in body &&
        body.gstin !== undefined &&
        typeof body.gstin !== "string"
    ) {
        throw new TenantInvalidInputError(
            "GSTIN must be a string"
        );
    }
}