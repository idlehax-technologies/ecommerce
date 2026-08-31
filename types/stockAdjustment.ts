export type StockAdjustmentRequest = {
    idempotencyKey: string;
    productId: string;
    delta: number;
};

export type AdjustedInventorySnapshot = {
    productId: string;
    stock: number;
    reserved: number;
};