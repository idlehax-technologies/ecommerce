import type { LowStockReport } from "@/types/lowStock";

export async function getLowStock(
    tenantId: string
): Promise<LowStockReport> {

    const res = await fetch(
        `/api/admin/tenants/${tenantId}/inventory/low-stock`,
        {
            credentials: "include",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch low stock");
    }

    return res.json();
}