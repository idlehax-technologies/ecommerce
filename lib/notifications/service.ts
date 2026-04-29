import type { DomainEvent } from "@/types/domainEvent";

import { mapEventToNotifications } from "./mappers";
import { deliverNotification } from "./adapters";

import {
    isNotificationProcessed,
    markNotificationProcessed
} from "./idempotency";

function buildKey(event: DomainEvent, idx: number, refId?: string) {
    return `${event.type}:${refId ?? "none"}:${idx}`;
}

export async function handleNotificationEvent(
    event: DomainEvent
) {
    const notifications = mapEventToNotifications(event);

    for (let i = 0; i < notifications.length; i++) {
        const n = notifications[i];

        const key = buildKey(event, i, n.reference?.id);

        if (isNotificationProcessed(key)) continue;

        await deliverNotification(n);

        markNotificationProcessed(key);
    }
}