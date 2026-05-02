import type { Job } from "@/types/job";
import { jobExecutors } from "./registry";

export async function execute(job: Job): Promise<void> {
    switch (job.type) {
        case "ORDER_EXPIRY":
            return jobExecutors.ORDER_EXPIRY(job);
        case "MEMBERSHIP_EXPIRY":
            return jobExecutors.MEMBERSHIP_EXPIRY(job);
        case "NOTIFICATION_DISPATCH":
            return jobExecutors.NOTIFICATION_DISPATCH(job);
    }
}