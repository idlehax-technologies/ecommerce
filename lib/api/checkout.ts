import type { Order } from "@/types/order";

import { apiFetch } from "./fetch";

export async function checkout(): Promise<{
    order: Order;
}> {

    return apiFetch<{
        order: Order;
    }>("/api/checkout", {
        method: "POST",
    });
}