import { enqueueJob } from "./service";
import { jobStore } from "./storage";

const MEMBERSHIP_SWEEP_INTERVAL_MS = 60_000;

let nextMembershipSweepAt = Date.now();
let blockedMembershipJobId: string | undefined;

export async function processRecurringJobs(): Promise<void> {
    const now = Date.now();

    const existing = await jobStore.findMembershipExpiryJob();

    if (existing) {
        // A failed sweep blocks automatic recurrence until
        // that same job is manually retried.
        if (existing.status === "FAILED") {
            blockedMembershipJobId = existing.jobId;
            return;
        }

        // The previously failed sweep was manually retried.
        // Resume the recurring schedule from this recovery.
        if (
            existing.jobId === blockedMembershipJobId &&
            existing.status === "PENDING"
        ) {
            nextMembershipSweepAt =
                now + MEMBERSHIP_SWEEP_INTERVAL_MS;

            blockedMembershipJobId = undefined;
            return;
        }

        // An active sweep already exists.
        if (
            existing.status === "PENDING" ||
            existing.status === "RUNNING"
        ) {
            return;
        }
    }

    if (now < nextMembershipSweepAt) {
        return;
    }

    await enqueueJob(
        "MEMBERSHIP_EXPIRY",
        {},
        new Date().toISOString(),
    );

    nextMembershipSweepAt =
        now + MEMBERSHIP_SWEEP_INTERVAL_MS;
}