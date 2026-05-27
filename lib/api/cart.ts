import { apiFetch } from "./fetch";

import type {
    Cart,
    AddToCartDTO,
    UpdateCartItemDTO,
} from "@/types/cart";

export async function getCart(): Promise<{ cart: Cart }> {
    return apiFetch<{ cart: Cart }>("/api/cart");
}

export async function addToCart(
    dto: AddToCartDTO
): Promise<{ cart: Cart }> {
    return apiFetch<{ cart: Cart }>("/api/cart", {
        method: "POST",
        body: JSON.stringify(dto),
    });
}

export async function updateItem(
    productId: string,
    dto: UpdateCartItemDTO
): Promise<{ cart: Cart }> {
    return apiFetch<{ cart: Cart }>(`/api/cart/${productId}`, {
        method: "PATCH",
        body: JSON.stringify(dto),
    });
}

export async function removeItem(
    productId: string
): Promise<{ cart: Cart }> {
    return apiFetch<{ cart: Cart }>(`/api/cart/${productId}`, {
        method: "DELETE",
    });
}

export async function clearCart(): Promise<{ success: true }> {
    return apiFetch<{ success: true }>("/api/cart", {
        method: "DELETE",
    });
}