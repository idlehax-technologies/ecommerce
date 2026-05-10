import { ReconciliationMismatchType } from "./reconciliation";

export type ResolutionActionType =
    | "CONFIRM_PAYMENT"
    | "CREATE_PAYMENT"
    | "CANCEL_ORDER"
    | "ADJUST_INVENTORY";

export type ResolutionRequest = {
    idempotencyKey: string; // ✅ NEW

    mismatchType: ReconciliationMismatchType;

    action: ResolutionActionType;

    orderId?: string;
    paymentId?: string;
    productId?: string;

    reason: string;
};