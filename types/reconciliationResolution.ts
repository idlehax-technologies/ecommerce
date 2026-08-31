import type { ReconciliationMismatchType } from "./reconciliation";

export type ResolutionActionType =
    | "CONFIRM_PAYMENT"
    | "CREATE_PAYMENT"
    | "CANCEL_ORDER"
    | "RECONCILE_RESERVED";

export type ResolutionRequest = {
    idempotencyKey: string;

    mismatchType: ReconciliationMismatchType;

    action: ResolutionActionType;

    orderId?: string;
    paymentId?: string;
    productId?: string;
};