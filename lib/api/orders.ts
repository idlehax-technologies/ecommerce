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

/**
 * Fetch all orders for current tenant
 */
export const getOrders = () =>
    fetch("/api/orders").then(handle<Order[]>);

/**
 * Fetch a single order
 */
export const getOrder = (orderId: string) =>
    fetch(`/api/orders/${orderId}`).then(handle<Order>);