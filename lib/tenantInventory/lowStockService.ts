import { detectLowStock } from "./lowStock";
import type { LowStockReport } from "@/types/lowStock";

export function getLowStockReport(
    tenantId: string
): LowStockReport {

    return detectLowStock(tenantId);
}