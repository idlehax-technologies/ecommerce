import { jobStore } from "./storage";
import { execute } from "./execute";

const MAX_ATTEMPTS = 5;
const RETRY_DELAY_MS = 5_000;

export async function runScheduler(): Promise<void> {
    const now = Date.now();

    const jobs = await jobStore.list();

    for (const job of jobs) {
        if (job.status !== "PENDING") continue;
        if (job.attempts >= MAX_ATTEMPTS) continue;

        if (new Date(job.runAt).getTime() > now) continue;

        const claimed = await jobStore.claim(job.jobId);
        if (!claimed) continue;

        try {
            await execute(claimed);

            await jobStore.update(claimed.jobId, (j) => ({
                ...j,
                status: "SUCCESS",
            }));
        } catch (err: unknown) {
            const nextAttempts = claimed.attempts + 1;

            await jobStore.update(claimed.jobId, (j) => ({
                ...j,
                status: nextAttempts >= MAX_ATTEMPTS ? "FAILED" : "PENDING",
                attempts: nextAttempts,
                lastError:
                    err instanceof Error
                        ? err.message
                        : "Unknown error",
                runAt: new Date(Date.now() + RETRY_DELAY_MS).toISOString(),
            }));
        }
    }
}