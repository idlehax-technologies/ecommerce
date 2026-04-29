import { apiFetch } from "./fetch";
import type { LowStockReport } from "@/types/lowStock";

export function getLowStock(
    tenantId: string
): Promise<LowStockReport> {
    return apiFetch(
        `/api/admin/tenants/${tenantId}/inventory/low-stock`
    );
}