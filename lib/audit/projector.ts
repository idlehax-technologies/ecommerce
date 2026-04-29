import { randomUUID } from "crypto";
import type { DomainEvent } from "@/types/domainEvent";
import type { AuditEventType } from "@/types/audit";

// 🔴 import ONLY internal write
import { __internal_appendAudit as appendAudit } from "./storage";

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
        case "MembershipRoleUpdated": return "MEMBERSHIP_ROLE_UPDATED";
        case "InventoryAdjusted": return "INVENTORY_ADJUSTED";
        case "PaymentConfirmed": return "PAYMENT_CONFIRMED";
        default: {
            const _exhaustive: never = e;
            return _exhaustive;
        }
    }
}

export function projectAudit(
    event: DomainEvent,
    ctx: { actorId: string }
) {
    const now = new Date().toISOString();

    function base(tenantId: string, entityType: string, entityId: string) {
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
            appendAudit({
                ...base(event.order.tenantId, "ORDER", event.order.orderId),
                to: { status: event.order.status },
                metadata: {}
            });
            break;

        case "OrderPaid":
        case "OrderCancelled":
        case "OrderExpired":
        case "OrderPickedUp":
        case "OrderRefunded":
            appendAudit({
                ...base(event.order.tenantId, "ORDER", event.order.orderId),
                from: { status: event.from },
                to: { status: event.to },
                metadata: {}
            });
            break;

        case "MembershipRequested":
            appendAudit({
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
            appendAudit({
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
            appendAudit({
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
            appendAudit({
                ...base(event.tenantId, "PRODUCT", event.productId),
                from: event.from,
                to: event.to,
                metadata: {}
            });
            break;

        case "PaymentConfirmed":
            appendAudit({
                ...base(
                    event.order.tenantId,
                    "PAYMENT",
                    event.payment.paymentId
                ),
                metadata: {
                    orderId: event.order.orderId
                }
            });
            break;
    }
}