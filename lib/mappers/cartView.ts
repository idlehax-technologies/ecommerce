import type { Cart, CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

export type CartItemView = {
    productId: string;

    title: string;
    price: number;
    discountPercent: number;

    quantity: number;
};

export type CartView = {
    tenantId: string;
    userId: string;

    items: CartItemView[];

    updatedAt: string;
};

export function toCartItemView(
    cartItem: CartItem,
    product: Product
): CartItemView {
    return {
        productId: cartItem.productId,

        title: product.title,
        price: product.price,
        discountPercent: product.discountPercent,

        quantity: cartItem.quantity,
    };
}

export function toCartView(
    cart: Cart,
    items: CartItemView[]
): CartView {
    return {
        tenantId: cart.tenantId,
        userId: cart.userId,

        items,

        updatedAt: cart.updatedAt,
    };
}