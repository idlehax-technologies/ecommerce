import { randomUUID } from "crypto";
import type { DomainEvent } from "@/types/domainEvent";
import type { AuditEventType, AuditEntityType } from "@/types/audit";

import { appendAudit } from "./domain";

function mapEventType(e: DomainEvent): AuditEventType {
    switch (e.type) {
        case "OrderCreated": return "ORDER_CREATED";
        case "OrderPaid": return "ORDER_PAID";
        case "OrderCancelled": return "ORDER_CANCELLED";
        case "OrderExpired": return "ORDER_EXPIRED";
        case "OrderPickedUp": return "ORDER_PICKED_UP";
        case "OrderRefunded": return "ORDER_REFUNDED";
        case "MembershipRequested": return "MEMBERSHIP_REQUESTED";
        case "MembershipApproved": return "MEMBERSHIP_APPROVED";
        case "MembershipRejected": return "MEMBERSHIP_REJECTED";
        case "MembershipRevoked": return "MEMBERSHIP_REVOKED";
        case "MembershipExpired": return "MEMBERSHIP_EXPIRED";
        case "MembershipRoleUpdated": return "MEMBERSHIP_ROLE_UPDATED";
        case "InventoryAdjusted": return "INVENTORY_ADJUSTED";
        case "InventoryReconciled": return "INVENTORY_RECONCILED";
        case "PaymentConfirmed": return "PAYMENT_CONFIRMED";
        default: {
            const _exhaustive: never = e;
            return _exhaustive;
        }
    }
}

export async function projectAudit(
    event: DomainEvent,
    ctx: { actorId: string }
): Promise<void> {
    const now = new Date().toISOString();

    function base(
        tenantId: string,
        entityType: AuditEntityType,
        entityId: string
    ) {
        return {
            auditId: randomUUID(),
            tenantId,
            actorId: ctx.actorId,
            eventType: mapEventType(event),
            entityType,
            entityId,
            metadata: {},
            createdAt: now,
        };
    }

    switch (event.type) {

        case "OrderCreated":
            await appendAudit({
                ...base(
                    event.order.tenantId,
                    "ORDER",
                    event.order.orderId
                ),
                to: { status: event.order.status },
                metadata: {
                    orderNumber: event.order.orderNumber,
                    total: event.order.total,
                    isStaffOrder: Boolean(event.order.placedByStaffId),
                }
            });
            break;

        case "OrderPaid":
            await appendAudit({
                ...base(
                    event.order.tenantId,
                    "ORDER",
                    event.order.orderId
                ),
                from: { status: event.from },
                to: { status: event.to },
                metadata: {
                    method: event.order.paymentMethod,
                }
            });
            break;

        case "OrderCancelled":
        case "OrderExpired":
        case "OrderPickedUp":
        case "OrderRefunded":
            await appendAudit({
                ...base(
                    event.order.tenantId,
                    "ORDER",
                    event.order.orderId
                ),
                from: { status: event.from },
                to: { status: event.to },
                metadata: {}
            });
            break;

        case "MembershipRequested":
            await appendAudit({
                ...base(
                    event.membership.tenantId,
                    "MEMBERSHIP",
                    event.membership.membershipId
                ),
                to: { status: event.membership.status },
                metadata: {}
            });
            break;

        case "MembershipApproved":
        case "MembershipRejected":
        case "MembershipRevoked":
        case "MembershipExpired":
            await appendAudit({
                ...base(
                    event.membership.tenantId,
                    "MEMBERSHIP",
                    event.membership.membershipId
                ),
                from: { status: event.from },
                to: { status: event.to },
                metadata: {}
            });
            break;

        case "MembershipRoleUpdated":
            await appendAudit({
                ...base(
                    event.membership.tenantId,
                    "MEMBERSHIP",
                    event.membership.membershipId
                ),
                from: { role: event.from },
                to: { role: event.to },
                metadata: {}
            });
            break;

        case "InventoryAdjusted":
            await appendAudit({
                ...base(
                    event.tenantId,
                    "INVENTORY",
                    event.productId
                ),
                from: { stock: event.from },
                to: { stock: event.to },
                metadata: {
                    delta: event.to - event.from,
                }
            });
            break;

        case "InventoryReconciled":
            await appendAudit({
                ...base(
                    event.tenantId,
                    "INVENTORY",
                    event.productId
                ),
                from: { reserved: event.from },
                to: { reserved: event.to },
                metadata: {
                    delta: event.to - event.from,
                }
            });
            break;

        case "PaymentConfirmed":
            await appendAudit({
                ...base(
                    event.payment.tenantId,
                    "PAYMENT",
                    event.payment.paymentId
                ),
                from: { status: event.from },
                to: { status: event.to },
                metadata: {
                    orderId: event.payment.orderId,
                    method: event.payment.method,
                }
            });
            break;
    }
}