import { apiFetch } from "./fetch";

import type {
    TenantProvisioningRow,
} from "@/lib/mappers/tenantProvisioningView";
import {
    TenantProductRow
} from "@/lib/mappers/tenantProductView";

import type {
    ProvisionProductDTO,
    TenantInventory,
} from "@/types/tenantInventory";

export async function getTenantInventoryView(): Promise<{
    rows: TenantProvisioningRow[];
}> {
    return apiFetch<{ rows: TenantProvisioningRow[] }>(
        "/api/inventory"
    );
}

export async function provisionProduct(
    tenantId: string,
    dto: ProvisionProductDTO
): Promise<{
    inventory: TenantInventory;
}> {
    return apiFetch<{
        inventory: TenantInventory;
    }>(
        `/api/admin/tenants/${tenantId}/inventory`,
        {
            method: "PUT",
            body: JSON.stringify(dto),
        }
    );
}

export async function getTenantProductView(): Promise<{
    rows: TenantProductRow[];
}> {
    return apiFetch<{ rows: TenantProductRow[] }>(
        "/api/inventory/products"
    );
}