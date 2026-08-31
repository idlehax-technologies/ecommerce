import type { TenantProductRow } from "./tenantProductView";

export type POSRow = TenantProductRow & {
    inCart: number;
    available: number;
};

export type POSRowWithAction = POSRow & {
    onSelect: () => void;
};

export function mapToPOSRows(
    rows: TenantProductRow[],
    cart: Record<string, number>
): POSRow[] {

    return rows.map((row) => {
        const productId = row.product.productId;
        const inCart = cart[productId] || 0;
        const available = row.available - inCart;

        return {
            ...row,
            inCart,
            available,
        };
    });
}