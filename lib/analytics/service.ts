import { listTenantOrders } from "@/lib/orders/domain";
import { computeAnalytics } from "./domain";
import type { TenantAnalytics } from "@/types/analytics";

export async function getTenantAnalytics(
    tenantId: string
): Promise<TenantAnalytics> {

    const orders = await listTenantOrders(tenantId);

    return computeAnalytics(tenantId, orders);
}
