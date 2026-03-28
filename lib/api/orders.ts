import type { Order } from "@/types/order";

const json = { "Content-Type": "application/json" };

async function handle<T>(res: Response): Promise<T> {
    const data: unknown = await res.json().catch(() => ({}));

    if (!res.ok) {
        let message = "Request failed";

        if (
            typeof data === "object" &&
            data !== null &&
            "error" in data &&
            typeof (data as { error?: unknown }).error === "string"
        ) {
            message = (data as { error: string }).error;
        }

        throw new Error(message);
    }

    return data as T;
}

export const getOrders = () =>
    fetch("/api/orders").then(handle<Order[]>);

export const getOrder = (orderId: string) =>
    fetch(`/api/orders/${orderId}`).then(handle<Order>);

export const payOrder = (orderId: string, method: string) =>
    fetch(`/api/orders/${orderId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method }),
    }).then(handle);

export const createPOSOrder = (payload: {
    items: { productId: string; quantity: number }[];
    paymentMethod?: string;
}) =>
    fetch(`/api/orders/pos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    }).then(handle);

export const cancelOrder = (orderId: string) =>
    fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
    }).then(handle);

export const pickupOrder = (orderId: string) =>
    fetch(`/api/orders/${orderId}/pickup`, {
        method: "POST",
    }).then(handle);

export const expireOrder = (orderId: string) =>
    fetch(`/api/orders/${orderId}/expire`, {
        method: "POST",
    }).then(handle);

export const refundOrder = (orderId: string) =>
    fetch(`/api/orders/${orderId}/refund`, {
        method: "POST",
    }).then(handle);