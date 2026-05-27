import type { Order } from "@/types/order";

import type { MembershipActor } from "@/types/auth";

import { ForbiddenError } from "../auth/errors";

function canViewOrder(
    actor: MembershipActor,
    order: Order
): boolean {
    if (
        order.tenantId !==
        actor.tenantId
    ) {
        return false;
    }
    if (
        actor.role === "customer" &&
        order.userId !== actor.userId
    ) {
        return false;
    }
    return true;
}

export function assertOrderVisible(
    actor: MembershipActor,
    order: Order
): void {
    if (!canViewOrder(actor, order)) {
        throw new ForbiddenError("Order access forbidden");
    }
}

export function filterVisibleOrders(
    actor: MembershipActor,
    orders: Order[]
): Order[] {
    return orders.filter((order) =>
        canViewOrder(actor, order)
    );
}