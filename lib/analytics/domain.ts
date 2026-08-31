import {
    getDiscountedPrice,
    getDiscountAmount,
} from "@/lib/calculations/pricing";

import type {
    AnalyticsSummary,
    DailyAnalytics,
    ProductSales,
    TenantAnalytics,
} from "@/types/analytics";

import type { Order } from "@/types/order";

const TOP_PRODUCTS_LIMIT = 10;

type ProductAccumulator = Omit<ProductSales, "productId">;

function now(): string {
    return new Date().toISOString();
}

function isRevenueOrder(order: Order): boolean {
    return order.status === "PAID" || order.status === "PICKED_UP";
}

export function computeAnalytics(
    tenantId: string,
    orders: Order[]
): TenantAnalytics {

    let totalOrders = 0;

    let reservedOrders = 0;
    let paidOrders = 0;
    let pickedUpOrders = 0;
    let cancelledOrders = 0;
    let expiredOrders = 0;
    let refundedOrders = 0;

    let totalUnitsSold = 0;

    let grossRevenue = 0;
    let discountGiven = 0;
    let netRevenue = 0;

    const dailyAnalyticsByDate =
        new Map<string, Omit<DailyAnalytics, "date">>();

    const productMap = new Map<string, ProductAccumulator>();

    for (const order of orders) {

        switch (order.status) {

            case "RESERVED":
                reservedOrders++;
                continue;

            case "PAID":
                paidOrders++;
                break;

            case "PICKED_UP":
                pickedUpOrders++;
                break;

            case "CANCELLED":
                cancelledOrders++;
                continue;

            case "EXPIRED":
                expiredOrders++;
                continue;

            case "REFUNDED":
                refundedOrders++;
                continue;
        }

        totalOrders++;

        const date = order.createdAt.slice(0, 10);

        const dailyAnalytics =
            dailyAnalyticsByDate.get(date) ?? {
                orders: 0,
                unitsSold: 0,

                grossRevenue: 0,
                discountGiven: 0,
                netRevenue: 0,
            };

        dailyAnalytics.orders++;

        for (const item of order.items) {

            const itemGrossRevenue =
                item.price * item.quantity;

            const itemDiscountGiven =
                getDiscountAmount(
                    item.price,
                    item.discountPercent
                ) * item.quantity;

            const itemNetRevenue =
                getDiscountedPrice(
                    item.price,
                    item.discountPercent
                ) * item.quantity;

            totalUnitsSold += item.quantity;

            dailyAnalytics.unitsSold += item.quantity;

            const existing =
                productMap.get(item.productId) ?? {
                    title: item.title,
                    sku: item.sku,

                    unitsSold: 0,

                    grossRevenue: 0,
                    discountGiven: 0,
                    netRevenue: 0,
                };

            existing.unitsSold += item.quantity;

            if (isRevenueOrder(order)) {

                grossRevenue += itemGrossRevenue;

                discountGiven += itemDiscountGiven;

                netRevenue += itemNetRevenue;

                dailyAnalytics.grossRevenue +=
                    itemGrossRevenue;

                dailyAnalytics.discountGiven +=
                    itemDiscountGiven;

                dailyAnalytics.netRevenue +=
                    itemNetRevenue;

                existing.grossRevenue +=
                    itemGrossRevenue;

                existing.discountGiven +=
                    itemDiscountGiven;

                existing.netRevenue +=
                    itemNetRevenue;
            }

            productMap.set(item.productId, existing);
        }

        dailyAnalyticsByDate.set(date, dailyAnalytics);
    }

    const dailyAnalytics: DailyAnalytics[] =
        Array.from(dailyAnalyticsByDate.entries())
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([date, analytics]) => ({ date, ...analytics }));

    const topProducts: ProductSales[] =
        Array.from(productMap.entries())
            .map(([productId, data]) => ({ productId, ...data }))
            .sort((a, b) => b.netRevenue - a.netRevenue)
            .slice(0, TOP_PRODUCTS_LIMIT);

    const summary: AnalyticsSummary = {
        totalOrders,

        reservedOrders,
        paidOrders,
        pickedUpOrders,
        cancelledOrders,
        expiredOrders,
        refundedOrders,

        totalUnitsSold,

        grossRevenue,
        discountGiven,
        netRevenue,
    };

    return {
        tenantId,
        generatedAt: now(),
        summary,
        dailyAnalytics,
        topProducts,
    };
}
