import * as paymentsDomain from "@/lib/payments/domain";
import * as ordersDomain from "@/lib/orders/domain";
import * as inventoryDomain from "@/lib/tenantInventory/domain";

import type { ResolutionRequest } from "@/types/reconciliationResolution";
import type { DomainEvent } from "@/types/domainEvent";

import { getResolutionPolicy } from "./policy";
import { tenantInventoryStore } from "../tenantInventory/storage";
import { isAlreadyProcessed, markProcessed } from "./idempotency";

/**
 * Controlled reconciliation entrypoint
 *
 * MUST:
 * - NOT execute side-effects
 * - NOT write audit logs
 * - ONLY return DomainEvents
 */
export async function resolveMismatch(input: {
    tenantId: string;
    actorId: string;
    request: ResolutionRequest;
}): Promise<{ events: DomainEvent[] }> {

    const { tenantId, request } = input;

    if (!request.idempotencyKey) {
        throw new Error("idempotencyKey required");
    }

    if (isAlreadyProcessed(request.idempotencyKey)) {
        return { events: [] }; // idempotent no-op
    }

    const policy = getResolutionPolicy(request.mismatchType);

    if (!policy.allowedActions.includes(request.action)) {
        throw new Error("Action not allowed for this mismatch");
    }

    const events: DomainEvent[] = [];

    switch (request.action) {

        /**
         * CONFIRM PAYMENT
         */
        case "CONFIRM_PAYMENT": {
            if (!request.orderId) {
                throw new Error("orderId required");
            }

            const result = paymentsDomain.confirmPayment(
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
                throw new Error("orderId required");
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
                throw new Error("orderId required");
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
                throw new Error("productId required");
            }

            const record = inventoryDomain.findTenantProvision(
                tenantId,
                request.productId
            );

            if (!record) {
                throw new Error("Inventory not found");
            }

            const orders = ordersDomain.listTenantOrders(tenantId);

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

            const corrected = {
                ...record,
                reserved: expectedReserved,
                updatedAt: new Date().toISOString(),
            };

            tenantInventoryStore.save(corrected);

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
            throw new Error("Unsupported resolution action");
    }
}