import type { Order } from "@/types/order";
import type {
    AnalyticsSummary,
    RevenuePoint,
    ProductSales,
    TenantAnalytics,
} from "@/types/analytics";

function isRevenueOrder(order: Order): boolean {
    return order.status === "PAID" || order.status === "PICKED_UP";
}

function isRefund(order: Order): boolean {
    return order.status === "REFUNDED";
}

export function computeAnalytics(
    tenantId: string,
    orders: Order[]
): TenantAnalytics {

    let totalOrders = 0;
    let totalRevenue = 0;
    let totalUnitsSold = 0;

    const revenueByDate = new Map<string, number>();

    const productMap = new Map<
        string,
        { name: string; units: number; revenue: number }
    >();

    for (const order of orders) {

        if (order.status === "CANCELLED" || order.status === "EXPIRED") {
            continue;
        }

        totalOrders++;

        const date = order.createdAt.slice(0, 10);

        if (isRevenueOrder(order)) {
            totalRevenue += order.total;

            revenueByDate.set(
                date,
                (revenueByDate.get(date) ?? 0) + order.total
            );
        }

        if (isRefund(order)) {
            totalRevenue -= order.total;

            revenueByDate.set(
                date,
                (revenueByDate.get(date) ?? 0) - order.total
            );
        }

        for (const item of order.items) {

            totalUnitsSold += item.quantity;

            const existing = productMap.get(item.productId) ?? {
                name: item.name,
                units: 0,
                revenue: 0,
            };

            existing.units += item.quantity;

            if (isRevenueOrder(order)) {
                existing.revenue += item.price * item.quantity;
            }

            if (isRefund(order)) {
                existing.revenue -= item.price * item.quantity;
            }

            productMap.set(item.productId, existing);
        }
    }

    const revenueTimeline: RevenuePoint[] =
        Array.from(revenueByDate.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, revenue]) => ({ date, revenue }));

    const topProducts: ProductSales[] =
        Array.from(productMap.entries())
            .map(([productId, data]) => ({
                productId,
                name: data.name,
                unitsSold: data.units,
                revenue: data.revenue,
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);

    const summary: AnalyticsSummary = {
        totalOrders,
        totalRevenue,
        totalUnitsSold,
    };

    return {
        tenantId,
        generatedAt: new Date().toISOString(),
        summary,
        revenueTimeline,
        topProducts,
    };
}
