import { jobStore } from "./storage";
import { enqueueJob } from "./service";
import { execute } from "./execute";

const MAX_ATTEMPTS = 5;

export async function runScheduler() {
    const now = Date.now();

    // ensure sweep exists (dedup-safe)
    enqueueJob(
        "MEMBERSHIP_EXPIRY",
        {},
        new Date().toISOString(),
        "membership-sweep"
    );

    const jobs = jobStore.list();

    for (const job of jobs) {
        if (job.status !== "PENDING") continue;
        if (job.attempts >= MAX_ATTEMPTS) continue;

        if (new Date(job.runAt).getTime() > now) continue;

        const claimed = jobStore.claim(job.jobId);
        if (!claimed) continue;

        try {
            await execute(claimed);

            jobStore.update(claimed.jobId, (j) => ({
                ...j,
                status: "SUCCESS",
            }));
        } catch (err: unknown) {
            const nextAttempts = claimed.attempts + 1;

            jobStore.update(claimed.jobId, (j) => ({
                ...j,
                status: nextAttempts >= MAX_ATTEMPTS ? "FAILED" : "PENDING",
                attempts: nextAttempts,
                lastError:
                    err instanceof Error
                        ? err.message
                        : "Unknown error",
                runAt: new Date(Date.now() + 5000).toISOString(),
            }));
        }
    }
}