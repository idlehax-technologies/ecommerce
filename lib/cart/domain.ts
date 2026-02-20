import type { Cart, AddToCartDTO, UpdateCartItemDTO } from "@/types/cart";
import type { TenantScopedActor } from "@/types/tenant";

import { getCartForTenant, saveCart, clearCart as clearStorage } from "./storage";
import { requireItem } from "./guards";

import { getProductForCart } from "@/lib/products/domain";

/* =========================================================
   Get cart (tenant-scoped aggregate)
   ========================================================= */

export function getCart(actor: TenantScopedActor): Cart {
    return getCartForTenant(actor.tenantId);
}

/* =========================================================
   Add item
   Product access is delegated to products domain.
   ========================================================= */

export async function addItem(
    actor: TenantScopedActor,
    dto: AddToCartDTO
): Promise<Cart> {
    const cart = getCartForTenant(actor.tenantId);

    // This enforces tenant access + existence checks centrally
    const product = await getProductForCart(actor, dto.productId);

    const quantityToAdd = dto.quantity ?? 1;

    const existing = cart.items.find(i => i.productId === product.productId);

    if (existing) {
        existing.quantity += quantityToAdd;
    } else {
        cart.items.push({
            productId: product.productId,
            title: product.title,
            price: product.price,
            quantity: quantityToAdd,
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
    } else {
        item.quantity = dto.quantity;
    }

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

    cart.items = cart.items.filter(i => i.productId !== productId);

    saveCart(cart);
    return cart;
}

/* =========================================================
   Clear cart
   ========================================================= */

export function clearCart(actor: TenantScopedActor) {
    clearStorage(actor.tenantId);
}
