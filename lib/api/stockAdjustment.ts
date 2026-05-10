import { apiFetch } from "./fetch";
import type { StockAdjustmentRequest } from "@/types/stockAdjustment";

type AdjustedStock = {
    productId: string;
    stock: number;
    reserved: number;
};

export async function adjustStock(
    tenantId: string,
    payload: StockAdjustmentRequest
): Promise<{ updated: AdjustedStock }> {

    const res = await apiFetch<{ updated: AdjustedStock }>(
        `/api/admin/tenants/${tenantId}/inventory/adjust`,
        {
            method: "POST",
            body: JSON.stringify(payload),
        }
    );

    return res;
}