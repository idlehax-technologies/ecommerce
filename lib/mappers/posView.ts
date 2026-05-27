import type { TenantProvisioningRow } from "./tenantProvisioningView";

export type POSRow = TenantProvisioningRow & {
    inCart: number;
    available: number;
};

export function mapToPOSRows(
    rows: TenantProvisioningRow[],
    cart: Record<string, number>
): POSRow[] {

    return rows.map((row) => {
        const productId = row.product.productId;
        const inCart = cart[productId] || 0;
        const available = row.stock - row.reserved - inCart;

        return {
            ...row,
            inCart,
            available,
        };
    });
}