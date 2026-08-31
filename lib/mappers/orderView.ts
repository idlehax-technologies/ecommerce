import type { Order, OrderListItem } from "@/types/order";

export function toOrderListItem(
    order: Order
): OrderListItem {
    return {
        orderId: order.orderId,
        orderNumber: order.orderNumber,
        invoiceNumber: order.invoiceNumber,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        isStaffOrder: !!order.placedByStaffId,
    };
}