import { apiFetch } from "./fetch";
import { toTenantProvisioningRow, TenantProvisioningRow } from "@/lib/mappers/tenantProvisioningView";
import type { Product } from "@/types/product";
import type { TenantInventory, ProvisionProductDTO } from "@/types/tenantInventory";

type RawRow = {
    product: Product;
    provision?: TenantInventory;
};

export async function getTenantInventoryView(
    tenantId: string
): Promise<{ rows: TenantProvisioningRow[] }> {

    const data = await apiFetch<{ rows: RawRow[] }>(
        `/api/admin/tenants/${tenantId}/inventory`
    );

    return {
        rows: data.rows.map(r =>
            toTenantProvisioningRow(r.product, r.provision)
        ),
    };
}

export async function provisionProduct(
    tenantId: string,
    dto: ProvisionProductDTO
): Promise<void> {
    await apiFetch(
        `/api/admin/tenants/${tenantId}/inventory`,
        {
            method: "PUT",
            body: JSON.stringify(dto),
        }
    );
}