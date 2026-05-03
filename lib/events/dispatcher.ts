import type { DomainEvent } from "@/types/domainEvent";
import { projectAudit } from "@/lib/audit/projector";
import { handleOrderEvent } from "@/lib/orders/reactions";
import { enqueueJob } from "@/lib/jobs/service";
import { recordEvent } from "../metrics";

type OrderEvent = Extract<DomainEvent, { type: `Order${string}` }>;

function buildNotificationDedupKey(event: DomainEvent): string {
    switch (event.type) {
        case "OrderCreated":
        case "OrderPaid":
        case "OrderCancelled":
        case "OrderExpired":
        case "OrderPickedUp":
        case "OrderRefunded":
            return `notif:order:${event.order.orderId}:${event.type}`;

        case "MembershipRequested":
        case "MembershipApproved":
        case "MembershipRejected":
        case "MembershipRevoked":
        case "MembershipExpired":
            return `notif:membership:${event.membership.membershipId}:${event.type}`;

        case "PaymentConfirmed":
            return `notif:payment:${event.payment.paymentId}`;

        default:
            return `notif:generic:${event.type}`;
    }
}

export async function dispatchEvent(
    event: DomainEvent,
    ctx: { actorId: string }
) {
    recordEvent(event.type);

    // domain reactions
    if (event.type.startsWith("Order")) {
        await handleOrderEvent(event as OrderEvent);
    }

    // order expiry scheduling
    if (event.type === "OrderCreated") {
        enqueueJob(
            "ORDER_EXPIRY",
            {
                tenantId: event.order.tenantId,
                orderId: event.order.orderId,
            },
            new Date(Date.now() + 15 * 60 * 1000).toISOString()
        );
    }

    // audit (must stay synchronous)
    projectAudit(event, ctx);

    // ✅ NEW: notifications → job system
    enqueueJob(
        "NOTIFICATION_DISPATCH",
        { event },
        new Date().toISOString(),
        buildNotificationDedupKey(event)
    );
}