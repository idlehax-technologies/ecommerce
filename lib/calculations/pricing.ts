import type { TenantProductRow } from "@/lib/mappers/tenantProductView";
import type { CartItemView } from "@/lib/mappers/cartView";
import type { ItemSnapshot } from "@/types/order";
import type { PricedItem, PricingTotals } from "@/types/pricing";

export function getDiscountedPrice(
    price: number,
    discountPercent: number
): number {
    return Math.floor(
        price * (100 - discountPercent) / 100
    );
}

export function getDiscountAmount(
    price: number,
    discountPercent: number
): number {
    return price - getDiscountedPrice(
        price,
        discountPercent
    );
}

function getPricingTotals(
    items: PricedItem[]
): PricingTotals {
    const mrpTotal = items.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    );

    const payableTotal = items.reduce(
        (sum, item) =>
            sum +
            getDiscountedPrice(
                item.price,
                item.discountPercent
            ) * item.quantity,
        0
    );

    return {
        mrpTotal,
        payableTotal,
        savings: mrpTotal - payableTotal,
    };
}

export function getCartTotals(
    items: CartItemView[]
): PricingTotals {
    return getPricingTotals(items);
}

export function getOrderTotals(
    items: ItemSnapshot[]
): PricingTotals {
    return getPricingTotals(items);
}

export function getPOSTotals(
    cart: Record<string, number>,
    rows: TenantProductRow[]
): PricingTotals {

    const items = Object.entries(cart)
        .flatMap(([productId, quantity]) => {

            const row = rows.find(
                (r) => r.product.productId === productId
            );

            if (!row) {
                return [];
            }

            return [{
                price: row.product.price,
                discountPercent: row.product.discountPercent,
                quantity,
            }];
        });

    return getPricingTotals(items);
}