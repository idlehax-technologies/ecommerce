import type { DomainEvent } from "@/types/domainEvent";

import { mapEventToNotifications } from "./mappers";
import { deliverNotification } from "./adapters";

import {
    claimNotificationIdempotency,
    releaseNotificationIdempotency,
} from "@/lib/redis/idempotency";

function buildKey(
    event: DomainEvent,
    idx: number,
    refId?: string
) {
    return `${event.type}:${refId ?? "none"}:${idx}`;
}

export async function handleNotificationEvent(
    event: DomainEvent
): Promise<void> {
    const notifications = mapEventToNotifications(event);

    for (let i = 0; i < notifications.length; i++) {
        const n = notifications[i];

        const key = buildKey(
            event,
            i,
            n.reference?.id
        );

        const claimed =
            await claimNotificationIdempotency(key);

        if (!claimed) {
            continue;
        }

        try {
            await deliverNotification(n);
        } catch (err: unknown) {
            await releaseNotificationIdempotency(key);
            throw err;
        }
    }
}