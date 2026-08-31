import * as orders from "@/lib/orders/domain";
import * as memberships from "@/lib/memberships/domain";
import { dispatchEvent } from "@/lib/events/dispatcher";
import { jobExecutors } from "./registry";
import { handleNotificationEvent } from "@/lib/notifications/service";

// ORDER — must be idempotent-safe
jobExecutors.ORDER_EXPIRY = async (job) => {
    const { tenantId, orderId } = job.payload;

    const result = await orders.expireOrder(tenantId, orderId);

    if (!result) {
        return;
    }

    await dispatchEvent(result.event, { actorId: "system" });
};

// MEMBERSHIP — already idempotent
jobExecutors.MEMBERSHIP_EXPIRY = async () => {
    const ids = await memberships.findExpiredMemberships();

    for (const id of ids) {
        const result = await memberships.expireMembership(id);

        if (!result) {
            continue;
        }

        await dispatchEvent(result.event, { actorId: "system" });
    }
};

// NOTIFICATIONS
jobExecutors.NOTIFICATION_DISPATCH = async (job) => {
    await handleNotificationEvent(job.payload.event);
};