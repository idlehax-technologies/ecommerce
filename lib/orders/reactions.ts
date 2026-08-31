import * as tenantInventoryDomain from "@/lib/tenantInventory/domain";
import type { DomainEvent } from "@/types/domainEvent";

export async function handleOrderEvent(
    event: DomainEvent
): Promise<void> {

    switch (event.type) {

        case "OrderCreated":
            break;

        case "OrderPaid":
            for (const item of event.order.items) {
                await tenantInventoryDomain.commitStock(
                    event.order.tenantId,
                    item.productId,
                    item.quantity
                );
            }
            break;

        case "OrderCancelled":
        case "OrderExpired":
            for (const item of event.order.items) {
                await tenantInventoryDomain.releaseStock(
                    event.order.tenantId,
                    item.productId,
                    item.quantity
                );
            }
            break;

        case "OrderPickedUp":
            break;

        case "OrderRefunded":
            for (const item of event.order.items) {
                await tenantInventoryDomain.releaseStock(
                    event.order.tenantId,
                    item.productId,
                    item.quantity
                );
            }
            break;

        default:
            break;
    }
}