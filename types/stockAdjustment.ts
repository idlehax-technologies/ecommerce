export type StockAdjustmentRequest = {
    idempotencyKey: string;

    productId: string;

    /**
     * absolute new stock value
     */
    newStock: number;

    reason: string;
};