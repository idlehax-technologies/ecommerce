import type { DomainEvent } from "@/types/domainEvent";
import { projectAudit } from "@/lib/audit/projector";
import { handleOrderEvent } from "@/lib/orders/reactions";

import { handleNotificationEvent } from "@/lib/notifications/service"; // ✅ NEW

type OrderEvent = Extract<DomainEvent, { type: `Order${string}` }>;

export async function dispatchEvent(
    event: DomainEvent,
    ctx: { actorId: string }
) {
    if (event.type.startsWith("Order")) {
        await handleOrderEvent(event as OrderEvent);
    }

    projectAudit(event, ctx);

    // 🔴 NEW — notifications
    await handleNotificationEvent(event);
}