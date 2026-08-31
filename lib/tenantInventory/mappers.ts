import type {
    TenantInventory,
    ProvisionProductDTO,
} from "@/types/tenantInventory";

export function toNewProvision(
    tenantId: string,
    dto: ProvisionProductDTO
): TenantInventory {

    const now = new Date().toISOString();

    return {
        tenantId,
        productId: dto.productId,
        enabled: dto.enabled,
        stock: 0,
        reserved: 0,
        createdAt: now,
        updatedAt: now,
    };
}

export function applyProvisionPatch(
    existing: TenantInventory,
    dto: ProvisionProductDTO
): TenantInventory {

    return {
        ...existing,
        enabled: dto.enabled,
        updatedAt: new Date().toISOString(),
    };
}