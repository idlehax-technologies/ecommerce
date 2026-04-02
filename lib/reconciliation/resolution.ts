import * as paymentsDomain from "@/lib/payments/domain";
import * as ordersDomain from "@/lib/orders/domain";
import * as inventoryDomain from "@/lib/tenantInventory/domain";

import { handleOrderEvent } from "@/lib/orders/reactions";
import { recordAuditLog } from "@/lib/audit/domain";

import type { ResolutionRequest } from "@/types/reconciliationResolution";
import { getResolutionPolicy } from "./policy";
import { tenantInventoryStore } from "../tenantInventory/storage";
import { isAlreadyProcessed, markProcessed } from "./idempotency";

/**
 * Controlled resolution entrypoint
 */
export async function resolveMismatch(input: {
    tenantId: string;
    actorId: string;
    request: ResolutionRequest;
}) {

    const { tenantId, actorId, request } = input;

    if (!request.idempotencyKey) {
        throw new Error("idempotencyKey required");
    }

    if (isAlreadyProcessed(request.idempotencyKey)) {
        return; // ✅ silent no-op (idempotent behavior)
    }

    // ✅ POLICY ENFORCEMENT (MANDATORY)
    const policy = getResolutionPolicy(request.mismatchType);

    if (!policy.allowedActions.includes(request.action)) {
        throw new Error("Action not allowed for this mismatch");
    }

    switch (request.action) {

        /**
         * 1. Confirm existing payment
         */
        case "CONFIRM_PAYMENT": {
            if (!request.orderId) throw new Error("orderId required");

            const result = paymentsDomain.confirmPayment(
                tenantId,
                request.orderId
            );

            if (result.event) {
                await handleOrderEvent(result.event);
            }

            recordAuditLog({
                tenantId,
                actorId,
                action: "CONFIRM_PAYMENT",
                entityType: "ORDER",
                entityId: request.orderId,
                metadata: { reason: request.reason },
            });

            markProcessed(request.idempotencyKey);

            return;
        }

        /**
         * 2. Create missing payment (safe reconstruction)
         */
        case "CREATE_PAYMENT": {
            if (!request.orderId) throw new Error("orderId required");

            const { payment } = paymentsDomain.recordPayment(
                tenantId,
                request.orderId,
                "CASH" // fallback — explicit system decision
            );

            recordAuditLog({
                tenantId,
                actorId,
                action: "CREATE_PAYMENT",
                entityType: "PAYMENT",
                entityId: payment.paymentId,
                metadata: { reason: request.reason },
            });

            markProcessed(request.idempotencyKey);

            return;
        }

        /**
         * 3. Cancel inconsistent order
         */
        case "CANCEL_ORDER": {
            if (!request.orderId) throw new Error("orderId required");

            const result = ordersDomain.cancelOrder(
                tenantId,
                request.orderId
            );

            if (result.event) {
                await handleOrderEvent(result.event);
            }

            recordAuditLog({
                tenantId,
                actorId,
                action: "CANCEL_ORDER",
                entityType: "ORDER",
                entityId: request.orderId,
                metadata: { reason: request.reason },
            });

            markProcessed(request.idempotencyKey);

            return;
        }

        /**
         * 4. Inventory correction (controlled override)
         */
        case "ADJUST_INVENTORY": {
            if (!request.productId) throw new Error("productId required");

            const record = inventoryDomain.findTenantProvision(
                tenantId,
                request.productId
            );

            if (!record) {
                throw new Error("Inventory not found");
            }

            /**
             * ✅ NON-DESTRUCTIVE RECOMPUTE
             */
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

            const corrected = {
                ...record,
                reserved: expectedReserved,
                updatedAt: new Date().toISOString(),
            };

            tenantInventoryStore.save(corrected);

            recordAuditLog({
                tenantId,
                actorId,
                action: "ADJUST_INVENTORY",
                entityType: "PRODUCT",
                entityId: request.productId,
                metadata: {
                    previousReserved: record.reserved,
                    correctedReserved: expectedReserved,
                    reason: request.reason,
                },
            });

            markProcessed(request.idempotencyKey);

            return;
        }

        default:
            throw new Error("Unsupported resolution action");
    }
}