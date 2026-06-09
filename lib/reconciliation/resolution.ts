import * as paymentsDomain from "@/lib/payments/domain";
import * as ordersDomain from "@/lib/orders/domain";
import * as tenantInventoryDomain from "@/lib/tenantInventory/domain";

import type { ResolutionRequest } from "@/types/reconciliationResolution";
import type { DomainEvent } from "@/types/domainEvent";

import { getResolutionPolicy } from "./policy";
import { isAlreadyProcessed, markProcessed } from "./idempotency";
import {
    ReconciliationActionNotAllowedError,
    ReconciliationInvalidInputError,
    ReconciliationInventoryNotFoundError,
    ReconciliationUnsupportedActionError
} from "./errors";

/**
 * Controlled reconciliation entrypoint
 *
 * MUST:
 * - NOT dispatch infrastructure side-effects
 * - NOT write audit logs
 * - ONLY return DomainEvents
 */
export async function resolveMismatch(input: {
    tenantId: string;
    actorId: string;    // Reserved for future audit/event attribution
    request: ResolutionRequest;
}): Promise<{ events: DomainEvent[] }> {

    const { tenantId, request } = input;

    if (!request.idempotencyKey) {
        throw new ReconciliationInvalidInputError("idempotencyKey required");
    }

    if (isAlreadyProcessed(request.idempotencyKey)) {
        return { events: [] }; // idempotent no-op
    }

    const policy = getResolutionPolicy(request.mismatchType);

    if (!policy.allowedActions.includes(request.action)) {
        throw new ReconciliationActionNotAllowedError();
    }

    const events: DomainEvent[] = [];

    switch (request.action) {

        /**
         * CONFIRM PAYMENT
         */
        case "CONFIRM_PAYMENT": {
            if (!request.orderId) {
                throw new ReconciliationInvalidInputError("orderId required");
            }

            const result = await paymentsDomain.confirmPayment(
                tenantId,
                request.orderId
            );

            events.push(...result.events);

            markProcessed(request.idempotencyKey);

            return { events };
        }

        /**
         * CREATE PAYMENT (no event — no state transition)
         */
        case "CREATE_PAYMENT": {
            if (!request.orderId) {
                throw new ReconciliationInvalidInputError("orderId required");
            }

            paymentsDomain.recordPayment(
                tenantId,
                request.orderId,
                "CASH"
            );

            markProcessed(request.idempotencyKey);

            return { events: [] };
        }

        /**
         * CANCEL ORDER
         */
        case "CANCEL_ORDER": {
            if (!request.orderId) {
                throw new ReconciliationInvalidInputError("orderId required");
            }

            const result = ordersDomain.cancelOrder(
                tenantId,
                request.orderId
            );

            events.push(result.event);

            markProcessed(request.idempotencyKey);

            return { events };
        }

        /**
         * ADJUST INVENTORY
         *
         * NOTE:
         * This is a controlled override — not going through adjustStock
         * So we MUST emit DomainEvent manually
         */
        case "ADJUST_INVENTORY": {
            if (!request.productId) {
                throw new ReconciliationInvalidInputError("productId required");
            }

            const record = await tenantInventoryDomain.findTenantProvision(
                tenantId,
                request.productId
            );

            if (!record) {
                throw new ReconciliationInventoryNotFoundError();
            }

            const orders = await ordersDomain.listTenantOrders(tenantId);

            let expectedReserved = 0;

            for (const order of orders) {
                if (order.status === "RESERVED") {
                    for (const item of order.items) {
                        if (item.productId === request.productId) {
                            expectedReserved += item.quantity;
                        }
                    }
                }
            }

            const before = {
                stock: record.stock,
                reserved: record.reserved
            };

            const corrected =
                await tenantInventoryDomain.reconcileReservedQuantity(
                    record,
                    expectedReserved
                );

            const after = {
                stock: corrected.stock,
                reserved: corrected.reserved
            };

            events.push({
                type: "InventoryAdjusted",
                tenantId,
                productId: request.productId,
                from: before,
                to: after
            });

            markProcessed(request.idempotencyKey);

            return { events };
        }

        default:
            throw new ReconciliationUnsupportedActionError("Unsupported resolution action");
    }
}