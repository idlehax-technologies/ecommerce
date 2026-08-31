import { apiFetch } from "./fetch";

import type { Order } from "@/types/order";
import { Payment, PaymentMethod } from "@/types/payment";

export async function getOrders(): Promise<{
    orders: Order[];
}> {
    return apiFetch<{ orders: Order[] }>(
        "/api/orders"
    );
}

export async function getOrder(
    orderId: string
): Promise<{
    order: Order;
}> {
    return apiFetch<{ order: Order }>(
        `/api/orders/${orderId}`
    );
}

export async function payOrder(
    orderId: string,
    method: PaymentMethod
): Promise<{
    payment: Payment;
}> {
    return apiFetch<{ payment: Payment }>(
        `/api/orders/${orderId}/pay`,
        {
            method: "POST",
            body: JSON.stringify({ method }),
        }
    );
}

export async function cancelOrder(
    orderId: string
): Promise<{ success: true }> {
    return apiFetch<{ success: true }>(
        `/api/orders/${orderId}/cancel`,
        {
            method: "POST",
        }
    );
}

export async function pickupOrder(
    orderId: string
): Promise<{ success: true }> {
    return apiFetch<{ success: true }>(
        `/api/orders/${orderId}/pickup`,
        {
            method: "POST",
        }
    );
}

export async function refundOrder(
    orderId: string
): Promise<{ success: true }> {
    return apiFetch<{ success: true }>(
        `/api/orders/${orderId}/refund`,
        {
            method: "POST",
        }
    );
}

export function getInvoiceUrl(
    orderId: string
): string {
    return `/api/orders/${orderId}/invoice`;
}