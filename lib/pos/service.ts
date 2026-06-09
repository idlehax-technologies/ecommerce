import { getActiveProduct } from "@/lib/products/domain";
import { getProfile } from "@/lib/profiles/domain";
import { getTenant } from "@/lib/tenants/domain";

import * as ordersDomain from "@/lib/orders/domain";
import * as tenantInventoryDomain from "@/lib/tenantInventory/domain";
import * as paymentsDomain from "@/lib/payments/domain";

import {
    toCustomerSnapshot,
    toItemSnapshot,
    toSellerSnapshot,
} from "@/lib/orders/mappers";

import type { Order } from "@/types/order";
import type { DomainEvent } from "@/types/domainEvent";
import { PaymentMethod } from "@/types/payment";

import { ProfileNotFoundError } from "@/lib/profiles/errors";

type POSItemInput = {
    productId: string;
    quantity: number;
};

type POSInput = {
    tenantId: string;
    staffId: string;
    items: POSItemInput[];
    paymentMethod?: PaymentMethod;
};

export async function executePOS(input: POSInput): Promise<{
    order: Order & { placedByStaffId: string };
    events: DomainEvent[];
}> {
    if (!input.items.length) {
        throw new Error("POS requires items");
    }

    const profile = getProfile(input.staffId);

    if (!profile) {
        throw new ProfileNotFoundError();
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
        toCustomerSnapshot(
            profile
        );

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

        // payment flow (2-step)
        if (input.paymentMethod) {
            // STEP 1 — create payment (PENDING)
            paymentsDomain.recordPayment(
                input.tenantId,
                order.orderId,
                input.paymentMethod
            );

            // STEP 2 — confirm payment (returns BOTH events)
            const paymentResult = await paymentsDomain.confirmPayment(
                input.tenantId,
                order.orderId
            );

            // include BOTH events
            events.push(...paymentResult.events);

            const enrichedPaidOrder: Order & { placedByStaffId: string } = {
                ...paymentResult.order,
                placedByStaffId: input.staffId,
            };

            return {
                order: enrichedPaidOrder,
                events,
            };
        }

        return {
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