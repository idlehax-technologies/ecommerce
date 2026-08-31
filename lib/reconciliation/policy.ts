import type { ResolutionPolicy } from "@/types/reconciliationPolicy";
import type { ReconciliationMismatchType } from "@/types/reconciliation";

/**
 * Central policy table
 *
 * This is the ONLY place that defines:
 * - what is allowed
 * - what is recommended
 */
const POLICY_MAP: Record<
    ReconciliationMismatchType,
    ResolutionPolicy
> = {

    ORDER_PAYMENT_MISSING: {
        mismatchType: "ORDER_PAYMENT_MISSING",
        allowedActions: ["CREATE_PAYMENT", "CANCEL_ORDER"],
        recommendedAction: "CREATE_PAYMENT",
        requiresConfirmation: true,
    },

    ORDER_PAID_BUT_PAYMENT_NOT_CONFIRMED: {
        mismatchType: "ORDER_PAID_BUT_PAYMENT_NOT_CONFIRMED",
        allowedActions: ["CONFIRM_PAYMENT"],
        recommendedAction: "CONFIRM_PAYMENT",
        requiresConfirmation: false,
    },

    ORDER_PAYMENT_AMOUNT_MISMATCH: {
        mismatchType: "ORDER_PAYMENT_AMOUNT_MISMATCH",
        allowedActions: ["CANCEL_ORDER"],
        recommendedAction: "CANCEL_ORDER",
        requiresConfirmation: true,
    },

    PAYMENT_WITHOUT_ORDER: {
        mismatchType: "PAYMENT_WITHOUT_ORDER",
        allowedActions: [], // intentionally no auto-fix
        requiresConfirmation: true,
    },

    INVENTORY_NEGATIVE_RESERVED: {
        mismatchType: "INVENTORY_NEGATIVE_RESERVED",
        allowedActions: ["RECONCILE_RESERVED"],
        recommendedAction: "RECONCILE_RESERVED",
        requiresConfirmation: true,
    },

    INVENTORY_RESERVED_EXCEEDS_STOCK: {
        mismatchType: "INVENTORY_RESERVED_EXCEEDS_STOCK",
        allowedActions: ["RECONCILE_RESERVED"],
        recommendedAction: "RECONCILE_RESERVED",
        requiresConfirmation: true,
    },

    INVENTORY_RESERVATION_MISMATCH: {
        mismatchType: "INVENTORY_RESERVATION_MISMATCH",
        allowedActions: ["RECONCILE_RESERVED"],
        recommendedAction: "RECONCILE_RESERVED",
        requiresConfirmation: true,
    },
};

/**
 * Public accessor
 */
export function getResolutionPolicy(
    mismatchType: ReconciliationMismatchType
): ResolutionPolicy {
    return POLICY_MAP[mismatchType];
}