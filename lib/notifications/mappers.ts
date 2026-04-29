import { randomUUID } from "crypto";
import type { DomainEvent } from "@/types/domainEvent";
import type { Notification } from "@/types/notification";

export function mapEventToNotifications(
    event: DomainEvent
): Notification[] {
    const now = new Date().toISOString();

    switch (event.type) {

        // -------------------------
        // ORDERS
        // -------------------------

        case "OrderCreated":
            return [
                {
                    notificationId: randomUUID(),
                    tenantId: event.order.tenantId,
                    userId: event.order.userId,
                    channel: "CONSOLE",
                    title: "Order placed",
                    message: "Your order has been placed successfully.",
                    reference: {
                        type: "ORDER",
                        id: event.order.orderId,
                    },
                    createdAt: now,
                }
            ];

        case "OrderPaid":
            return [
                {
                    notificationId: randomUUID(),
                    tenantId: event.order.tenantId,
                    userId: event.order.userId,
                    channel: "CONSOLE",
                    title: "Payment successful",
                    message: "Your payment has been confirmed.",
                    reference: {
                        type: "ORDER",
                        id: event.order.orderId,
                    },
                    createdAt: now,
                }
            ];

        case "OrderCancelled":
            return [
                {
                    notificationId: randomUUID(),
                    tenantId: event.order.tenantId,
                    userId: event.order.userId,
                    channel: "CONSOLE",
                    title: "Order cancelled",
                    message: "Your order has been cancelled.",
                    reference: {
                        type: "ORDER",
                        id: event.order.orderId,
                    },
                    createdAt: now,
                }
            ];

        case "OrderExpired":
            return [
                {
                    notificationId: randomUUID(),
                    tenantId: event.order.tenantId,
                    userId: event.order.userId,
                    channel: "CONSOLE",
                    title: "Order expired",
                    message: "Your order has expired due to inactivity.",
                    reference: {
                        type: "ORDER",
                        id: event.order.orderId,
                    },
                    createdAt: now,
                }
            ];

        case "OrderPickedUp":
            return [
                {
                    notificationId: randomUUID(),
                    tenantId: event.order.tenantId,
                    userId: event.order.userId,
                    channel: "CONSOLE",
                    title: "Order picked up",
                    message: "Your order has been picked up successfully.",
                    reference: {
                        type: "ORDER",
                        id: event.order.orderId,
                    },
                    createdAt: now,
                }
            ];

        case "OrderRefunded":
            return [
                {
                    notificationId: randomUUID(),
                    tenantId: event.order.tenantId,
                    userId: event.order.userId,
                    channel: "CONSOLE",
                    title: "Refund processed",
                    message: "Your refund has been processed.",
                    reference: {
                        type: "ORDER",
                        id: event.order.orderId,
                    },
                    createdAt: now,
                }
            ];

        // -------------------------
        // MEMBERSHIP
        // -------------------------

        case "MembershipRequested":
            return [
                {
                    notificationId: randomUUID(),
                    tenantId: event.membership.tenantId,
                    userId: event.membership.userId,
                    channel: "CONSOLE",
                    title: "Membership requested",
                    message: "Your membership request has been submitted.",
                    reference: {
                        type: "MEMBERSHIP",
                        id: event.membership.membershipId,
                    },
                    createdAt: now,
                }
            ];

        case "MembershipApproved":
            return [
                {
                    notificationId: randomUUID(),
                    tenantId: event.membership.tenantId,
                    userId: event.membership.userId,
                    channel: "CONSOLE",
                    title: "Membership approved",
                    message: "Your membership has been approved.",
                    reference: {
                        type: "MEMBERSHIP",
                        id: event.membership.membershipId,
                    },
                    createdAt: now,
                }
            ];

        case "MembershipRejected":
            return [
                {
                    notificationId: randomUUID(),
                    tenantId: event.membership.tenantId,
                    userId: event.membership.userId,
                    channel: "CONSOLE",
                    title: "Membership rejected",
                    message: "Your membership request has been rejected.",
                    reference: {
                        type: "MEMBERSHIP",
                        id: event.membership.membershipId,
                    },
                    createdAt: now,
                }
            ];

        case "MembershipRevoked":
            return [
                {
                    notificationId: randomUUID(),
                    tenantId: event.membership.tenantId,
                    userId: event.membership.userId,
                    channel: "CONSOLE",
                    title: "Membership revoked",
                    message: "Your membership has been revoked.",
                    reference: {
                        type: "MEMBERSHIP",
                        id: event.membership.membershipId,
                    },
                    createdAt: now,
                }
            ];

        // -------------------------
        // DEFAULT
        // -------------------------

        default:
            return [];
    }
}