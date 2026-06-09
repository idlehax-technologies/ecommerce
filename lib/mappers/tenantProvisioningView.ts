import type { Product } from "@/types/product";
import type { TenantInventory } from "@/types/tenantInventory";

/**
 * UI-facing model.
 * This is NOT a domain entity.
 * It is an editable projection.
 */
export type TenantProvisioningRow = {
    product: Product;
    enabled: boolean;
    stock: number;
    reserved: number;
    available: number;
    isProvisioned: boolean;
};

export function toTenantProvisioningRow(
    product: Product,
    provision?: TenantInventory
): TenantProvisioningRow {

    if (!provision) {
        return {
            product,
            enabled: false,
            stock: 0,
            reserved: 0,
            available: 0,
            isProvisioned: false,
        };
    }

    return {
        product,
        enabled: provision.enabled,
        stock: provision.stock,
        reserved: provision.reserved,
        available: provision.stock - provision.reserved,
        isProvisioned: true,
    };
}