import { apiFetch } from "./fetch";

import type {
    TenantProvisioningRow,
} from "@/lib/mappers/tenantProvisioningView";

import type {
    ProvisionProductDTO,
    TenantInventory,
} from "@/types/tenantInventory";

export async function getTenantInventoryView(
    tenantId: string
): Promise<{
    rows: TenantProvisioningRow[];
}> {
    return apiFetch<{
        rows: TenantProvisioningRow[];
    }>(
        `/api/admin/tenants/${tenantId}/inventory`
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