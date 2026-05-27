import type { Job } from "@/types/job";

const globalStore = globalThis as any;

const store: Map<string, Job> =
    globalStore.__jobStore ?? new Map();

globalStore.__jobStore = store;

export const jobStore = {
    save(job: Job): void {
        store.set(job.jobId, job);
    },

    get(jobId: string): Job | undefined {
        return store.get(jobId);
    },

    list(): Job[] {
        return Array.from(store.values());
    },

    findByDedupKey(dedupKey: string): Job | undefined {
        for (const job of store.values()) {
            if (job.dedupKey === dedupKey) return job;
        }
        return undefined;
    },

    update(jobId: string, updater: (j: Job) => Job): void {
        const job = store.get(jobId);
        if (!job) return;

        const updated = updater(job);
        store.set(jobId, updated);
    },

    claim(jobId: string): Job | null {
        const job = store.get(jobId);

        if (!job) return null;
        if (job.status !== "PENDING") return null;

        const claimed: Job = {
            ...job,
            status: "RUNNING",
        };

        store.set(jobId, claimed);
        return claimed;
    },
};