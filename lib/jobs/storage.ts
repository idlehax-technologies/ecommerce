import type { Job, JobType, JobStatus } from "@/types/job";
import type { DomainEvent } from "@/types/domainEvent";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "../generated/prisma/client";

function toJob(
    job: {
        jobId: string;
        type: JobType;
        status: JobStatus;
        attempts: number;
        runAt: Date;
        createdAt: Date;
        lastError: string | null;
        dedupKey: string | null;

        orderExpiryPayload: {
            tenantId: string;
            orderId: string;
        } | null;

        membershipExpiryPayload: {} | null;

        notificationDispatchPayload: {
            event: Prisma.JsonValue;
        } | null;
    }
): Job {

    switch (job.type) {

        case "ORDER_EXPIRY": {
            if (!job.orderExpiryPayload) {
                throw new Error(
                    `Job ${job.jobId} is missing ORDER_EXPIRY payload`
                );
            }

            return {
                jobId: job.jobId,
                type: "ORDER_EXPIRY",
                status: job.status,
                attempts: job.attempts,
                runAt: job.runAt.toISOString(),
                createdAt: job.createdAt.toISOString(),

                ...(job.lastError !== null
                    ? {
                        lastError: job.lastError,
                    }
                    : {}),

                ...(job.dedupKey !== null
                    ? {
                        dedupKey: job.dedupKey,
                    }
                    : {}),

                payload: {
                    tenantId:
                        job.orderExpiryPayload.tenantId,
                    orderId:
                        job.orderExpiryPayload.orderId,
                },
            };
        }

        case "MEMBERSHIP_EXPIRY": {
            if (!job.membershipExpiryPayload) {
                throw new Error(
                    `Job ${job.jobId} is missing MEMBERSHIP_EXPIRY payload`
                );
            }

            return {
                jobId: job.jobId,
                type: "MEMBERSHIP_EXPIRY",
                status: job.status,
                attempts: job.attempts,
                runAt: job.runAt.toISOString(),
                createdAt: job.createdAt.toISOString(),

                ...(job.lastError !== null
                    ? {
                        lastError: job.lastError,
                    }
                    : {}),

                ...(job.dedupKey !== null
                    ? {
                        dedupKey: job.dedupKey,
                    }
                    : {}),

                payload: {},
            };
        }

        case "NOTIFICATION_DISPATCH": {
            if (!job.notificationDispatchPayload) {
                throw new Error(
                    `Job ${job.jobId} is missing NOTIFICATION_DISPATCH payload`
                );
            }

            return {
                jobId: job.jobId,
                type: "NOTIFICATION_DISPATCH",
                status: job.status,
                attempts: job.attempts,
                runAt: job.runAt.toISOString(),
                createdAt: job.createdAt.toISOString(),

                ...(job.lastError !== null
                    ? {
                        lastError: job.lastError,
                    }
                    : {}),

                ...(job.dedupKey !== null
                    ? {
                        dedupKey: job.dedupKey,
                    }
                    : {}),

                payload: {
                    event:
                        job.notificationDispatchPayload.event as DomainEvent,
                },
            };
        }

        default: {
            const _exhaustive: never = job.type;
            throw new Error(
                `Unhandled job type: ${_exhaustive}`
            );
        }
    }
}

const jobInclude = {
    orderExpiryPayload: true,
    membershipExpiryPayload: true,
    notificationDispatchPayload: true,
} as const;

export const jobStore = {

    async save(
        job: Job
    ): Promise<void> {

        switch (job.type) {

            case "ORDER_EXPIRY":
                await prisma.job.create({
                    data: {
                        jobId: job.jobId,
                        type: job.type,
                        status: job.status,
                        attempts: job.attempts,
                        runAt: new Date(job.runAt),
                        createdAt: new Date(job.createdAt),
                        ...(job.lastError !== undefined
                            ? {
                                lastError: job.lastError,
                            }
                            : {}),
                        ...(job.dedupKey !== undefined
                            ? {
                                dedupKey: job.dedupKey,
                            }
                            : {}),
                        orderExpiryPayload: {
                            create: {
                                tenantId:
                                    job.payload.tenantId,
                                orderId:
                                    job.payload.orderId,
                            },
                        },
                    },
                });
                return;

            case "MEMBERSHIP_EXPIRY":
                await prisma.job.create({
                    data: {
                        jobId: job.jobId,
                        type: job.type,
                        status: job.status,
                        attempts: job.attempts,
                        runAt: new Date(job.runAt),
                        createdAt: new Date(job.createdAt),
                        ...(job.lastError !== undefined
                            ? {
                                lastError: job.lastError,
                            }
                            : {}),
                        ...(job.dedupKey !== undefined
                            ? {
                                dedupKey: job.dedupKey,
                            }
                            : {}),
                        membershipExpiryPayload: {
                            create: {},
                        },
                    },
                });
                return;

            case "NOTIFICATION_DISPATCH":
                await prisma.job.create({
                    data: {
                        jobId: job.jobId,
                        type: job.type,
                        status: job.status,
                        attempts: job.attempts,
                        runAt: new Date(job.runAt),
                        createdAt: new Date(job.createdAt),
                        ...(job.lastError !== undefined
                            ? {
                                lastError: job.lastError,
                            }
                            : {}),
                        ...(job.dedupKey !== undefined
                            ? {
                                dedupKey: job.dedupKey,
                            }
                            : {}),
                        notificationDispatchPayload: {
                            create: {
                                event:
                                    job.payload.event as Prisma.InputJsonValue,
                            },
                        },
                    },
                });
                return;

            default: {
                const _exhaustive: never = job;
                throw new Error(
                    `Unhandled job type: ${_exhaustive}`
                );
            }
        }
    },

    async get(
        jobId: string
    ): Promise<Job | undefined> {

        const job =
            await prisma.job.findUnique({
                where: {
                    jobId,
                },
                include: jobInclude,
            });

        if (!job) {
            return undefined;
        }

        return toJob(job);
    },

    async list(): Promise<Job[]> {

        const jobs =
            await prisma.job.findMany({
                include: jobInclude,
            });

        return jobs.map(toJob);
    },

    async findByDedupKey(
        dedupKey: string
    ): Promise<Job | undefined> {

        const job =
            await prisma.job.findUnique({
                where: {
                    dedupKey,
                },
                include: jobInclude,
            });

        if (!job) {
            return undefined;
        }

        return toJob(job);
    },

    async findMembershipExpiryJob(): Promise<Job | undefined> {

        const activeJob =
            await prisma.job.findFirst({
                where: {
                    type: "MEMBERSHIP_EXPIRY",
                    status: {
                        in: ["PENDING", "RUNNING"],
                    },
                },
                include: jobInclude,
            });

        if (activeJob) {
            return toJob(activeJob);
        }

        const latestJob =
            await prisma.job.findFirst({
                where: {
                    type: "MEMBERSHIP_EXPIRY",
                },
                orderBy: {
                    createdAt: "desc",
                },
                include: jobInclude,
            });

        if (!latestJob) {
            return undefined;
        }

        return toJob(latestJob);
    },

    async update(
        jobId: string,
        updater: (job: Job) => Job
    ): Promise<void> {

        const existing =
            await prisma.job.findUnique({
                where: {
                    jobId,
                },
                include: jobInclude,
            });

        if (!existing) {
            return;
        }

        const job = toJob(existing);
        const updated = updater(job);

        await prisma.job.update({
            where: {
                jobId,
            },
            data: {
                status: updated.status,
                attempts: updated.attempts,
                runAt: new Date(updated.runAt),

                ...(updated.lastError !== undefined
                    ? {
                        lastError: updated.lastError,
                    }
                    : {
                        lastError: null,
                    }),
            },
        });
    },

    async claim(
        jobId: string
    ): Promise<Job | null> {

        const result =
            await prisma.job.updateMany({
                where: {
                    jobId,
                    status: "PENDING",
                },
                data: {
                    status: "RUNNING",
                },
            });

        if (result.count === 0) {
            return null;
        }

        const claimed =
            await prisma.job.findUnique({
                where: {
                    jobId,
                },
                include: jobInclude,
            });

        if (!claimed) {
            return null;
        }

        return toJob(claimed);
    },
};