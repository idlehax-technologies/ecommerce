import { apiFetch } from "./fetch";
import type { StockAdjustmentRequest } from "@/types/stockAdjustment";

type AdjustedStock = {
    productId: string;
    stock: number;
    reserved: number;
};

type AdjustResponse = {
    updated: AdjustedStock;
};

export async function adjustStock(
    tenantId: string,
    payload: StockAdjustmentRequest
): Promise<AdjustedStock> {

    const res = await apiFetch<AdjustResponse>(
        `/api/admin/tenants/${tenantId}/inventory/adjust`,
        {
            method: "POST",
            body: JSON.stringify(payload),
        }
    );

    return res.updated; // ✅ FIX
}