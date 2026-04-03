export type LowStockItem = {
    productId: string;
    stock: number;
    reserved: number;
    available: number;
    threshold: number;
};

export type LowStockReport = {
    tenantId: string;
    scannedAt: string;
    items: LowStockItem[];
};