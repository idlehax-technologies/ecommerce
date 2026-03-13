import type { Order } from "@/types/order";
import { OrderNotFoundError } from "./errors";

export function requireOrder(order: Order | undefined): Order {
    if (!order) {
        throw new OrderNotFoundError();
    }

    return order;
}