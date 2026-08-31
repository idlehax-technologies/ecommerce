import type {
    ResolutionRequest,
    ResolutionActionType,
} from "@/types/reconciliationResolution";

import type {
    ReconciliationMismatchType,
} from "@/types/reconciliation";

import { ReconciliationInvalidInputError } from "./errors";

function isNonEmptyString(
    value: unknown
): value is string {
    return (
        typeof value === "string" &&
        value.trim().length > 0
    );
}

const ACTIONS: ResolutionActionType[] = [
    "CONFIRM_PAYMENT",
    "CREATE_PAYMENT",
    "CANCEL_ORDER",
    "RECONCILE_RESERVED",
];

const MISMATCH_TYPES: ReconciliationMismatchType[] = [
    "ORDER_PAYMENT_MISSING",
    "PAYMENT_WITHOUT_ORDER",
    "ORDER_PAYMENT_AMOUNT_MISMATCH",
    "ORDER_PAID_BUT_PAYMENT_NOT_CONFIRMED",
    "INVENTORY_NEGATIVE_RESERVED",
    "INVENTORY_RESERVED_EXCEEDS_STOCK",
    "INVENTORY_RESERVATION_MISMATCH",
];

export function assertResolutionRequest(
    body: unknown
): asserts body is ResolutionRequest {

    if (!body || typeof body !== "object") {
        throw new ReconciliationInvalidInputError("Invalid request body");
    }

    const obj = body as Record<string, unknown>;

    if (!isNonEmptyString(obj.idempotencyKey)) {
        throw new ReconciliationInvalidInputError(
            "idempotencyKey must be a non-empty string"
        );
    }

    if (
        typeof obj.action !== "string" ||
        !ACTIONS.includes(
            obj.action as ResolutionActionType
        )
    ) {
        throw new ReconciliationInvalidInputError(
            "Invalid resolution action"
        );
    }

    if (
        typeof obj.mismatchType !== "string" ||
        !MISMATCH_TYPES.includes(
            obj.mismatchType as ReconciliationMismatchType
        )
    ) {
        throw new ReconciliationInvalidInputError(
            "Invalid mismatch type"
        );
    }

    if (
        "orderId" in obj &&
        obj.orderId !== undefined &&
        !isNonEmptyString(obj.orderId)
    ) {
        throw new ReconciliationInvalidInputError(
            "orderId must be a non-empty string"
        );
    }

    if (
        "paymentId" in obj &&
        obj.paymentId !== undefined &&
        !isNonEmptyString(obj.paymentId)
    ) {
        throw new ReconciliationInvalidInputError(
            "paymentId must be a non-empty string"
        );
    }

    if (
        "productId" in obj &&
        obj.productId !== undefined &&
        !isNonEmptyString(obj.productId)
    ) {
        throw new ReconciliationInvalidInputError(
            "productId must be a non-empty string"
        );
    }
}