import type { Cart, AddToCartDTO, UpdateCartItemDTO } from "@/types/cart";
import type { TenantScopedActor } from "@/types/tenant";

import { getCartForTenant, saveCart, clearCart as clearStorage } from "./storage";
import { requireItem } from "./guards";

import { getProductForCart } from "@/lib/products/domain";
import { findTenantProvision } from "../tenantInventory/domain";
import { getAvailableStock } from "../tenantInventory/reservations";

import {
    CartProductUnavailableError,
    CartStockExceededError,
    InvalidQuantityError
} from "./errors";

/* =========================================================
   Get cart
   ========================================================= */

export function getCart(actor: TenantScopedActor): Cart {
    return getCartForTenant(actor.tenantId);
}

/* =========================================================
   Add item
   ========================================================= */

export async function addItem(
    actor: TenantScopedActor,
    dto: AddToCartDTO
): Promise<Cart> {

    const cart = getCartForTenant(actor.tenantId);

    const product = await getProductForCart(dto.productId);

    const provision = findTenantProvision(actor.tenantId, product.productId);

    if (!provision || !provision.enabled) {
        throw new CartProductUnavailableError();
    }

    const quantityToAdd = dto.quantity ?? 1;

    if (quantityToAdd <= 0) {
        throw new InvalidQuantityError("Quantity must be greater than zero");
    }

    const existing = cart.items.find(
        (i) => i.productId === product.productId
    );

    const newQuantity = existing
        ? existing.quantity + quantityToAdd
        : quantityToAdd;

    /**
     * Step-4 fix:
     * validate against AVAILABLE stock
     */

    const available = getAvailableStock(provision);

    if (newQuantity > available) {
        throw new CartStockExceededError();
    }

    if (existing) {

        existing.quantity = newQuantity;

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

export function updateItem(
    actor: TenantScopedActor,
    productId: string,
    dto: UpdateCartItemDTO
): Cart {

    const cart = getCartForTenant(actor.tenantId);

    const item = requireItem(cart, productId);

    if (dto.quantity <= 0) {
        cart.items = cart.items.filter(i => i.productId !== productId);
        saveCart(cart);
        return cart;
    }

    const provision = findTenantProvision(actor.tenantId, productId);

    if (!provision || !provision.enabled) {
        throw new CartProductUnavailableError();
    }

    /**
     * Step-4 fix:
     * use available stock
     */

    const available = getAvailableStock(provision);

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
    actor: TenantScopedActor,
    productId: string
): Cart {

    const cart = getCartForTenant(actor.tenantId);

    cart.items = cart.items.filter((i) => i.productId !== productId);

    saveCart(cart);
    return cart;
}

/* =========================================================
   Clear cart
   ========================================================= */

export function clearCart(actor: TenantScopedActor): void {
    clearStorage(actor.tenantId);
}