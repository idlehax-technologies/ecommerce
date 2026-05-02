import type { Job } from "@/types/job";

export type JobExecutor<T extends Job = Job> = (job: T) => Promise<void>;

type ExecutorMap = {
    [K in Job["type"]]: JobExecutor<Extract<Job, { type: K }>>;
};

export const jobExecutors: ExecutorMap = {
    ORDER_EXPIRY: async () => {
        throw new Error("ORDER_EXPIRY not implemented");
    },

    MEMBERSHIP_EXPIRY: async () => {
        throw new Error("MEMBERSHIP_EXPIRY not implemented");
    },

    NOTIFICATION_DISPATCH: async () => {
        throw new Error("NOTIFICATION_DISPATCH not implemented");
    },
};