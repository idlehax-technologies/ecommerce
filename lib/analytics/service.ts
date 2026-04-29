import { listTenantOrders } from "@/lib/orders/domain";
import { computeAnalytics } from "./domain";
import type { TenantAnalytics } from "@/types/analytics";

export function getTenantAnalytics(
    tenantId: string
): TenantAnalytics {

    const orders = listTenantOrders(tenantId);

    return computeAnalytics(tenantId, orders);
}
