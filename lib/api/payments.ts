import { apiFetch } from "./fetch";
import type { Order } from "@/types/order";

export async function confirmPayment(orderId: string): Promise<{
    order: Order;
}> {
    return apiFetch(`/api/payments/${orderId}/confirm`, {
        method: "POST",
    });
}

export function getReceiptUrl(orderId: string): string {
    return `/api/orders/${orderId}/receipt`;
}