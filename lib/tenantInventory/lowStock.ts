import { listTenantInventory } from "./domain";
import type { LowStockReport, LowStockItem } from "@/types/lowStock";

const LOW_STOCK_THRESHOLD = 5;

export function detectLowStock(
    tenantId: string
): LowStockReport {

    const scannedAt = new Date().toISOString();

    const inventory = listTenantInventory(tenantId);

    const items: LowStockItem[] = [];

    for (const record of inventory) {

        const available = record.stock - record.reserved;

        if (available <= LOW_STOCK_THRESHOLD) {
            items.push({
                productId: record.productId,
                stock: record.stock,
                reserved: record.reserved,
                available,
                threshold: LOW_STOCK_THRESHOLD,
            });
        }
    }

    return {
        tenantId,
        scannedAt,
        items,
    };
}