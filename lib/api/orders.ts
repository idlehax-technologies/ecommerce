import { apiFetch } from "./fetch";
import type { Order } from "@/types/order";

export const getOrders = () =>
    apiFetch<Order[]>("/api/orders");

export const getOrder = (orderId: string) =>
    apiFetch<Order>(`/api/orders/${orderId}`);

export const payOrder = (
    orderId: string,
    method: string
) =>
    apiFetch<{ order: Order }>(
        `/api/orders/${orderId}/pay`,
        {
            method: "POST",
            body: JSON.stringify({ method }),
        }
    );

export const createPOSOrder = (payload: {
    items: { productId: string; quantity: number }[];
    paymentMethod?: string;
}) =>
    apiFetch<{ order: Order & { placedByStaffId: string }; }>(
        `/api/orders/pos`,
        {
            method: "POST",
            body: JSON.stringify(payload),
        }
    );

export const cancelOrder = (orderId: string) =>
    apiFetch(`/api/orders/${orderId}/cancel`, { method: "POST" });

export const pickupOrder = (orderId: string) =>
    apiFetch(`/api/orders/${orderId}/pickup`, { method: "POST" });

export const expireOrder = (orderId: string) =>
    apiFetch(`/api/orders/${orderId}/expire`, { method: "POST" });

export const refundOrder = (orderId: string) =>
    apiFetch(`/api/orders/${orderId}/refund`, { method: "POST" });