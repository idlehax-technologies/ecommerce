// lib/cart/domain.ts

import type {
    Cart,
    AddToCartDTO,
    UpdateCartItemDTO,
} from "@/types/cart";

import {
    getCart,
    saveCart,
    clearCart as clearStorage,
} from "./storage";

import { requireItem } from "./guards";

import { getProductForCart } from "@/lib/products/domain";

import { findTenantProvision }
    from "../tenantInventory/domain";

import { getAvailableStock }
    from "../tenantInventory/reservations";

import {
    CartProductUnavailableError,
    CartStockExceededError,
    InvalidQuantityError,
} from "./errors";

/* =========================================================
   Get cart
   ========================================================= */

export function getUserCart(
    tenantId: string,
    userId: string
): Cart {

    return getCart(
        tenantId,
        userId
    );
}

/* =========================================================
   Add item
   ========================================================= */

export async function addItem(
    tenantId: string,
    userId: string,
    dto: AddToCartDTO
): Promise<Cart> {

    const cart = getCart(
        tenantId,
        userId
    );

    const product =
        await getProductForCart(
            dto.productId
        );

    const provision =
        await findTenantProvision(
            tenantId,
            product.productId
        );

    if (
        !provision ||
        !provision.enabled
    ) {
        throw new CartProductUnavailableError();
    }

    const quantityToAdd =
        dto.quantity ?? 1;

    if (quantityToAdd <= 0) {
        throw new InvalidQuantityError(
            "Quantity must be greater than zero"
        );
    }

    const existing = cart.items.find(
        (i) =>
            i.productId ===
            product.productId
    );

    const newQuantity = existing
        ? existing.quantity + quantityToAdd
        : quantityToAdd;

    const available =
        getAvailableStock(
            provision
        );

    if (newQuantity > available) {
        throw new CartStockExceededError();
    }

    if (existing) {

        existing.quantity =
            newQuantity;

    } else {

        cart.items.push({
            productId: product.productId,
            title: product.title,
            price: product.price,
            quantity: newQuantity,
        });
    }

    saveCart(cart);

    return cart;
}

/* =========================================================
   Update quantity
   ========================================================= */

export async function updateItem(
    tenantId: string,
    userId: string,
    productId: string,
    dto: UpdateCartItemDTO
): Promise<Cart> {

    const cart = getCart(
        tenantId,
        userId
    );

    const item = requireItem(
        cart,
        productId
    );

    if (dto.quantity <= 0) {

        cart.items = cart.items.filter(
            (i) =>
                i.productId !==
                productId
        );

        saveCart(cart);

        return cart;
    }

    const provision =
        await findTenantProvision(
            tenantId,
            productId
        );

    if (
        !provision ||
        !provision.enabled
    ) {
        throw new CartProductUnavailableError();
    }

    const available =
        getAvailableStock(
            provision
        );

    if (dto.quantity > available) {
        throw new CartStockExceededError();
    }

    item.quantity = dto.quantity;

    saveCart(cart);

    return cart;
}

/* =========================================================
   Remove item
   ========================================================= */

export function removeItem(
    tenantId: string,
    userId: string,
    productId: string
): Cart {

    const cart = getCart(
        tenantId,
        userId
    );

    cart.items = cart.items.filter(
        (i) =>
            i.productId !==
            productId
    );

    saveCart(cart);

    return cart;
}

/* =========================================================
   Clear cart
   ========================================================= */

export function clearCart(
    tenantId: string,
    userId: string
): void {

    clearStorage(
        tenantId,
        userId
    );
}