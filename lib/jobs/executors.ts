import * as orders from "@/lib/orders/domain";
import * as memberships from "@/lib/memberships/domain";
import { dispatchEvent } from "@/lib/events/dispatcher";
import { enqueueJob } from "./service";
import { jobExecutors } from "./registry";
import { handleNotificationEvent } from "@/lib/notifications/service";

// ORDER — must be idempotent-safe
jobExecutors.ORDER_EXPIRY = async (job) => {
    try {
        const { tenantId, orderId } = job.payload;

        const result = orders.expireOrder(tenantId, orderId);

        await dispatchEvent(result.event, { actorId: "system" });
    } catch (err: any) {
        if (err?.name === "InvalidOrderTransitionError") return;
        throw err;
    }
};

// MEMBERSHIP — already idempotent
jobExecutors.MEMBERSHIP_EXPIRY = async () => {
    const ids = memberships.findExpiredMemberships();

    for (const id of ids) {
        const result = memberships.expireMembership(id);
        if (!result) continue;

        await dispatchEvent(result.event, { actorId: "system" });
    }

    // dedup-safe scheduling
    enqueueJob(
        "MEMBERSHIP_EXPIRY",
        {},
        new Date(Date.now() + 60_000).toISOString(),
        "membership-sweep"
    );
};

// NOTIFICATIONS
jobExecutors.NOTIFICATION_DISPATCH = async (job) => {
    await handleNotificationEvent(job.payload.event);
};