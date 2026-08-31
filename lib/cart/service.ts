import { getProductForCart }
    from "@/lib/products/domain";

import {
    toCartView,
    toCartItemView,
} from "@/lib/mappers/cartView";

import type { CartView } from "@/lib/mappers/cartView";

import type { Cart } from "@/types/cart";

export async function getCartView(
    cart: Cart
): Promise<CartView> {

    const items = await Promise.all(
        cart.items.map(async (item) => {

            const product =
                await getProductForCart(
                    item.productId
                );

            return toCartItemView(
                item,
                product
            );
        })
    );

    return toCartView(
        cart,
        items
    );
}