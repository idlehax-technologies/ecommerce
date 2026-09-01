export type JobStatus =
    | "PENDING"
    | "RUNNING"
    | "SUCCESS"
    | "FAILED";

export type BaseJob = {
    jobId: string;
    status: JobStatus;
    attempts: number;
    runAt: string;
    createdAt: string;
    lastError?: string;
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
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
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