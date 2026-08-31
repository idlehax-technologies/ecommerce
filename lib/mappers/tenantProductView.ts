import type { Product } from "@/types/product";
import type { TenantInventory } from "@/types/tenantInventory";

export type TenantProductRow = {
    product: Product;
    stock: number;
    reserved: number;
    available: number;
};

export function toTenantProductRow(
    product: Product,
    inventory: TenantInventory
): TenantProductRow {
    return {
        product,
        stock: inventory.stock,
        reserved: inventory.reserved,
        available: inventory.stock - inventory.reserved,
    };
}