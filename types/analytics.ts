export type AnalyticsSummary = {
    totalOrders: number;
    totalRevenue: number;
    totalUnitsSold: number;
};

export type RevenuePoint = {
    date: string;
    revenue: number;
};

export type ProductSales = {
    productId: string;
    name: string;
    unitsSold: number;
    revenue: number;
};

export type TenantAnalytics = {
    tenantId: string;
    generatedAt: string;

    summary: AnalyticsSummary;

    revenueTimeline: RevenuePoint[];

    topProducts: ProductSales[];
};
