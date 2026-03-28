import type { TenantProvisioningRow } from "./tenantProvisioningView";

export type POSRow = TenantProvisioningRow & {
    reserved: number;
    available: number;
};

export function mapToPOSRows(
    rows: TenantProvisioningRow[],
    cart: Record<string, number>
): POSRow[] {
    return rows.map((row) => {
        const productId = row.product.productId;

        const reserved = cart[productId] || 0;
        const available = row.stock - reserved;

        return {
            ...row,
            reserved,
            available,
        };
    });
}