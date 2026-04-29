import { apiFetch } from "./fetch";
import type { Cart, AddToCartDTO, UpdateCartItemDTO } from "@/types/cart";

export const getCart = () =>
    apiFetch<Cart>("/api/cart");

export const addToCart = (dto: AddToCartDTO) =>
    apiFetch<Cart>("/api/cart", {
        method: "POST",
        body: JSON.stringify(dto),
    });

export const updateItem = (productId: string, dto: UpdateCartItemDTO) =>
    apiFetch<Cart>(`/api/cart/${productId}`, {
        method: "PATCH",
        body: JSON.stringify(dto),
    });

export const removeItem = (productId: string) =>
    apiFetch<Cart>(`/api/cart/${productId}`, {
        method: "DELETE",
    });

export const clearCart = () =>
    apiFetch<void>("/api/cart", {
        method: "DELETE",
    });