import { apiFetch } from "./fetch";

import type {
    StockAdjustmentRequest,
    AdjustedInventorySnapshot,
} from "@/types/stockAdjustment";

export async function adjustStockBy(
    tenantId: string,
    payload: StockAdjustmentRequest
): Promise<{
    updated: AdjustedInventorySnapshot;
}> {

    return apiFetch<{
        updated: AdjustedInventorySnapshot;
    }>(
        `/api/admin/tenants/${tenantId}/inventory/adjust`,
        {
            method: "POST",
            body: JSON.stringify(payload),
        }
    );
}