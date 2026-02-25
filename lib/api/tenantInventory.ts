// lib/api/tenantInventory.ts

import { toTenantProvisioningRow, TenantProvisioningRow } from "@/lib/mappers/tenantProvisioningView";
import type { Product } from "@/types/product";
import type { TenantInventory, ProvisionProductDTO } from "@/types/tenantInventory";

type RawRow = {
    product: Product;
    provision?: TenantInventory;
};

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        credentials: "include",
        ...options,
    });

    if (!res.ok) {
        const text = await res.text();
        console.error("API ERROR:", text);
        throw new Error(text || "Request failed");
    }

    return res.json();
}

/**
 * Returns UI projection only.
 */
export async function getTenantInventoryView(
    tenantId: string
): Promise<{ rows: TenantProvisioningRow[] }> {
    const data: { rows: RawRow[] } = await fetchJSON(`/api/admin/tenants/${tenantId}/inventory`);

    return {
        rows: data.rows.map(r => toTenantProvisioningRow(r.product, r.provision)),
    };
}

/**
 * Command adapter (UI never builds TenantInventory directly)
 */
export async function provisionProduct(
    tenantId: string,
    dto: ProvisionProductDTO
): Promise<void> {
    await fetchJSON(`/api/admin/tenants/${tenantId}/inventory`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
}