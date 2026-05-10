import { Order } from "@/types/order";
import { apiFetch } from "./fetch";
import type { CheckoutRequest } from "@/types/checkout";

export function checkout(
    payload: CheckoutRequest
): Promise<{ order: Order }> {
    return apiFetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}