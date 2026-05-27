import { randomUUID } from "crypto";
import { jobStore } from "./storage";
import type { Job, JobType } from "@/types/job";
import { JobNotFoundError, JobRetryNotAllowedError } from "./errors";

export function enqueueJob<T extends JobType>(
    type: T,
    payload: Extract<Job, { type: T }>["payload"],
    runAt: string,
    dedupKey?: string
): void {
    if (dedupKey) {
        const existing = jobStore.findByDedupKey(dedupKey);
        if (existing && existing.status !== "FAILED") return;
    }

    const base = {
        jobId: randomUUID(),
        status: "PENDING" as const,
        attempts: 0,
        runAt,
        createdAt: new Date().toISOString(),
        dedupKey,
    };

    let job: Job;

    switch (type) {
        case "ORDER_EXPIRY": {
            const p = payload as Extract<Job, { type: "ORDER_EXPIRY" }>["payload"];

            job = {
                ...base,
                type: "ORDER_EXPIRY",
                payload: p,
            };
            break;
        }

        case "MEMBERSHIP_EXPIRY": {
            const p = payload as Extract<Job, { type: "MEMBERSHIP_EXPIRY" }>["payload"];

            job = {
                ...base,
                type: "MEMBERSHIP_EXPIRY",
                payload: p,
            };
            break;
        }

        case "NOTIFICATION_DISPATCH": {
            const p = payload as Extract<Job, { type: "NOTIFICATION_DISPATCH" }>["payload"];

            job = {
                ...base,
                type: "NOTIFICATION_DISPATCH",
                payload: p,
            };
            break;
        }

        default: {
            const _exhaustive: never = type;
            throw new Error(`Unhandled job type: ${_exhaustive}`);
        }
    }

    jobStore.save(job);
}

export function listJobs(): Job[] {
    return jobStore.list();
}

export function retryJob(jobId: string): void {
    const job = jobStore.get(jobId);

    if (!job) {
        throw new JobNotFoundError();
    }

    if (job.status !== "FAILED") {
        throw new JobRetryNotAllowedError();
    }

    jobStore.update(jobId, (j) => ({
        ...j,
        status: "PENDING",
        attempts: 0,
        lastError: undefined,
    }));
}