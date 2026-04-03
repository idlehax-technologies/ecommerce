import type { StockAdjustmentRequest } from "@/types/stockAdjustment";
import type { TenantInventory } from "@/types/tenantInventory";

export async function adjustStock(
    tenantId: string,
    payload: StockAdjustmentRequest
): Promise<TenantInventory> {

    const res = await fetch(
        `/api/admin/tenants/${tenantId}/inventory/adjust`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
        }
    );

    if (!res.ok) {
        throw new Error("Stock adjustment failed");
    }

    return res.json();
}