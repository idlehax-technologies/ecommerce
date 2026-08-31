import { processRecurringJobs } from "./recurring";

const SCHEDULER_INTERVAL_MS = 5_000;

let started = false;

export async function startJobLoop(): Promise<void> {
    if (started) return;
    started = true;

    async function tick(): Promise<void> {
        try {
            await processRecurringJobs();

            const { runScheduler } = await import("./runner");
            await runScheduler();
        } catch (err: unknown) {
            console.error("Job loop error:", err);
        } finally {
            setTimeout(tick, SCHEDULER_INTERVAL_MS);
        }
    }

    tick();
}