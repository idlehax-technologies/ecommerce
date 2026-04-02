export type ReconciliationMismatchType =
    | "ORDER_PAYMENT_MISSING"
    | "PAYMENT_WITHOUT_ORDER"
    | "ORDER_PAYMENT_AMOUNT_MISMATCH"
    | "ORDER_PAID_BUT_PAYMENT_NOT_CONFIRMED"
    | "INVENTORY_NEGATIVE_RESERVED"
    | "INVENTORY_RESERVED_EXCEEDS_STOCK"
    | "INVENTORY_RESERVATION_MISMATCH";

export type ReconciliationMismatch = {
    type: ReconciliationMismatchType;

    tenantId: string;

    orderId?: string;
    paymentId?: string;
    productId?: string;

    expected: unknown;
    actual: unknown;

    detectedAt: string;
};

export type ReconciliationReport = {
    tenantId: string;
    scannedAt: string;
    mismatches: ReconciliationMismatch[];
};