import type { Order, OrderListItem } from "@/types/order";

export function toOrderListItem(order: Order): OrderListItem {
    return {
        orderId: order.orderId,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
    };
}