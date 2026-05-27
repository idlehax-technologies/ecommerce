export type JobStatus =
    | "PENDING"
    | "RUNNING"
    | "SUCCESS"
    | "FAILED";

export type BaseJob = {
    jobId: string;
    status: JobStatus;
    attempts: number;
    lastError?: string;
    runAt: string;
    createdAt: string;
    dedupKey?: string;
};

export type OrderExpiryJob = BaseJob & {
    type: "ORDER_EXPIRY";
    payload: {
        tenantId: string;
        orderId: string;
    };
};

export type MembershipExpiryJob = BaseJob & {
    type: "MEMBERSHIP_EXPIRY";
    payload: {};
};

export type NotificationDispatchJob = BaseJob & {
    type: "NOTIFICATION_DISPATCH";
    payload: {
        event: import("./domainEvent").DomainEvent;
    };
};

export type Job =
    | OrderExpiryJob
    | MembershipExpiryJob
    | NotificationDispatchJob;

export type JobType = Job["type"];