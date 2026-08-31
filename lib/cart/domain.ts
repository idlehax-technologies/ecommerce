import type {
    Cart,
    AddToCartDTO,
    UpdateCartItemDTO,
    CartItem,
} from "@/types/cart";

import { RemovedCartItem } from "@/types/checkout";

import { cartStore } from "./storage";

import { requireItem } from "./guards";

import { getActiveProduct, getProductForCart } from "@/lib/products/domain";

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

export async function getUserCart(
    tenantId: string,
    userId: string
): Promise<Cart> {

    return cartStore.get(
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

    const cart = await cartStore.get(
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
            quantity: newQuantity,
        });
    }

    await cartStore.save(cart);

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

    const cart = await cartStore.get(
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

        await cartStore.save(cart);

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

    await cartStore.save(cart);

    return cart;
}

/* =========================================================
   Remove item
   ========================================================= */

export async function removeItem(
    tenantId: string,
    userId: string,
    productId: string
): Promise<Cart> {

    const cart = await cartStore.get(
        tenantId,
        userId
    );

    cart.items = cart.items.filter(
        (i) =>
            i.productId !==
            productId
    );

    await cartStore.save(cart);

    return cart;
}

/* =========================================================
   Clear cart
   ========================================================= */

export async function clearCart(
    tenantId: string,
    userId: string
): Promise<void> {

    await cartStore.clear(
        tenantId,
        userId
    );
}

/* =========================================================
   Remove unavailable items
   ========================================================= */

export async function removeUnavailableItems(
    tenantId: string,
    userId: string
): Promise<RemovedCartItem[]> {

    const cart = await cartStore.get(
        tenantId,
        userId
    );

    const removed: RemovedCartItem[] = [];

    const remaining: CartItem[] = [];

    for (const item of cart.items) {

        const provision =
            await findTenantProvision(
                tenantId,
                item.productId
            );

        if (
            !provision ||
            !provision.enabled
        ) {
            removed.push({
                productId: item.productId,
                reason: "NOT_PROVISIONED",
            });

            continue;
        }

        try {

            await getActiveProduct(
                item.productId
            );

            remaining.push(item);

        } catch {

            removed.push({
                productId: item.productId,
                reason: "INACTIVE",
            });
        }
    }

    if (removed.length > 0) {

        cart.items = remaining;

        await cartStore.save(cart);
    }

    return removed;
}