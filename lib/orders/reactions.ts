import * as tenantInventoryDomain from "@/lib/tenantInventory/domain";
import type { OrderEvent } from "@/types/orderEvent";

export async function handleOrderEvent(
    event: OrderEvent
): Promise<void> {

    switch (event.type) {

        case "OrderCreated":
            break;

        case "OrderPaid":

            for (const item of event.order.items) {

                tenantInventoryDomain.commitStock(
                    event.order.tenantId,
                    item.productId,
                    item.quantity
                );
            }

            break;

        case "OrderCancelled":
        case "OrderExpired":

            for (const item of event.order.items) {

                tenantInventoryDomain.releaseStock(
                    event.order.tenantId,
                    item.productId,
                    item.quantity
                );
            }

            break;

        case "OrderPickedUp":
            break;
    }
}