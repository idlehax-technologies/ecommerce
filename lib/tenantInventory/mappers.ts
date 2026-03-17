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
        stock: dto.stock,
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
        stock: dto.stock,
        updatedAt: new Date().toISOString(),
    };
}