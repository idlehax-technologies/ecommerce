import { apiFetch } from "./fetch";
import type { Order } from "@/types/order";
import type { Payment } from "@/types/payment";

export async function confirmPayment(orderId: string): Promise<{
    payment: Payment;
    order: Order;
}> {
    return apiFetch<{
        payment: Payment;
        order: Order;
    }>(
        `/api/payments/${orderId}/confirm`,
        {
            method: "POST",
        }
    );
}