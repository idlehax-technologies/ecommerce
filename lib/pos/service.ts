import { getActiveProduct } from "@/lib/products/domain";
import { getTenant } from "@/lib/tenants/domain";

import * as ordersDomain from "@/lib/orders/domain";
import * as tenantInventoryDomain from "@/lib/tenantInventory/domain";

import {
    toGuestCustomerSnapshot,
    toItemSnapshot,
    toSellerSnapshot,
} from "@/lib/orders/mappers";

import { EmptyOrderItemsError } from "@/lib/orders/errors";

import type { Order } from "@/types/order";
import type { DomainEvent } from "@/types/domainEvent";
import type {
    POSInput,
    POSItemInput,
    RemovedPOSItem,
    POSResult,
} from "@/types/pos";

async function findUnavailableItems(
    tenantId: string,
    items: POSItemInput[]
): Promise<RemovedPOSItem[]> {

    const removed: RemovedPOSItem[] = [];

    for (const item of items) {

        const provision =
            await tenantInventoryDomain.findTenantProvision(
                tenantId,
                item.productId
            );

        if (
            !provision ||
            !provision.enabled
        ) {
            removed.push({
                productId: item.productId,
                reason: "NOT_PROVISIONED",
            });

            continue;
        }

        try {

            await getActiveProduct(
                item.productId
            );

        } catch {

            removed.push({
                productId: item.productId,
                reason: "INACTIVE",
            });
        }
    }

    return removed;
}

export async function executePOS(
    input: POSInput
): Promise<POSResult> {
    if (!input.items.length) {
        throw new EmptyOrderItemsError();
    }

    const unavailableItems =
        await findUnavailableItems(
            input.tenantId,
            input.items
        );

    if (unavailableItems.length > 0) {
        return {
            success: false,
            removedItems: unavailableItems,
        };
    }

    const tenant =
        await getTenant(
            input.tenantId
        );

    const seller =
        toSellerSnapshot(
            tenant
        );

    const customer =
        toGuestCustomerSnapshot();

    const items =
        await Promise.all(
            input.items.map(
                async (item) => {
                    const product =
                        await getActiveProduct(
                            item.productId
                        );

                    return toItemSnapshot(
                        product,
                        item.quantity
                    );
                }
            )
        );

    // reserve stock
    for (const item of items) {
        await tenantInventoryDomain.reserveStock(
            input.tenantId,
            item.productId,
            item.quantity
        );
    }

    try {
        const { order, event: orderCreatedEvent } =
            await ordersDomain.createOrder(
                input.tenantId,
                input.staffId,
                seller,
                customer,
                items,
                input.staffId
            );

        const enrichedOrder: Order & { placedByStaffId: string } = {
            ...order,
            placedByStaffId: input.staffId,
        };

        const events: DomainEvent[] = [orderCreatedEvent];

        return {
            success: true,
            order: enrichedOrder,
            events,
        };

    } catch (err) {
        // rollback reservation
        for (const item of items) {
            await tenantInventoryDomain.releaseStock(
                input.tenantId,
                item.productId,
                item.quantity
            );
        }
        throw err;
    }
}