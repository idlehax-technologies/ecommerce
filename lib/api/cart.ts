import { apiFetch } from "./fetch";

import type {
    AddToCartDTO,
    UpdateCartItemDTO,
} from "@/types/cart";

import type {
    CartView,
} from "@/lib/mappers/cartView";

export async function getCart(): Promise<{ cart: CartView }> {
    return apiFetch<{ cart: CartView }>("/api/cart");
}

export async function addToCart(
    dto: AddToCartDTO
): Promise<{ cart: CartView }> {
    return apiFetch<{ cart: CartView }>("/api/cart", {
        method: "POST",
        body: JSON.stringify(dto),
    });
}

export async function updateItem(
    productId: string,
    dto: UpdateCartItemDTO
): Promise<{ cart: CartView }> {
    return apiFetch<{ cart: CartView }>(`/api/cart/${productId}`, {
        method: "PATCH",
        body: JSON.stringify(dto),
    });
}

export async function removeItem(
    productId: string
): Promise<{ cart: CartView }> {
    return apiFetch<{ cart: CartView }>(`/api/cart/${productId}`, {
        method: "DELETE",
    });
}

export async function clearCart(): Promise<{ success: true }> {
    return apiFetch<{ success: true }>("/api/cart", {
        method: "DELETE",
    });
}