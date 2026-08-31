export type AnalyticsSummary = {
    totalOrders: number;

    reservedOrders: number;
    paidOrders: number;
    pickedUpOrders: number;
    cancelledOrders: number;
    expiredOrders: number;
    refundedOrders: number;

    totalUnitsSold: number;

    grossRevenue: number;
    discountGiven: number;
    netRevenue: number;
};

export type DailyAnalytics = {
    date: string;

    orders: number;
    unitsSold: number;

    grossRevenue: number;
    discountGiven: number;
    netRevenue: number;
};

export type ProductSales = {
    productId: string;

    title: string;
    sku: string;

    unitsSold: number;

    grossRevenue: number;
    discountGiven: number;
    netRevenue: number;
};

export type TenantAnalytics = {
    tenantId: string;
    generatedAt: string;

    summary: AnalyticsSummary;

    dailyAnalytics: DailyAnalytics[];

    topProducts: ProductSales[];
};