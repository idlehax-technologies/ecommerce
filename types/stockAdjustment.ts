export type StockAdjustmentRequest = {
    idempotencyKey: string;

    productId: string;

    /**
     * absolute new stock value
     */
    newStock: number;
};

export type AdjustedInventorySnapshot = {
    productId: string;
    stock: number;
    reserved: number;
};