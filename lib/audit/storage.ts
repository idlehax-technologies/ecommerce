import type { AuditLog } from "@/types/audit";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "../generated/prisma/client";

export const auditStore = {
    async append(
        log: AuditLog
    ): Promise<void> {

        await prisma.auditLog.create({
            data: {
                auditId: log.auditId,
                tenantId: log.tenantId,
                actorId: log.actorId,
                eventType: log.eventType,
                entityType: log.entityType,
                entityId: log.entityId,

                ...(log.from !== undefined
                    ? {
                        from: log.from as Prisma.InputJsonValue,
                    }
                    : {}),

                to: log.to as Prisma.InputJsonValue,

                metadata: log.metadata as Prisma.InputJsonValue,

                createdAt: new Date(log.createdAt),
            },
        });
    },

    async listByTenant(
        tenantId: string,
        limit?: number
    ): Promise<AuditLog[]> {

        const logs =
            await prisma.auditLog.findMany({
                where: {
                    tenantId,
                },
                orderBy: {
                    createdAt: "desc",
                },
                ...(limit !== undefined
                    ? {
                        take: limit,
                    }
                    : {}),
            });

        return logs.map((log) => ({
            auditId: log.auditId,
            tenantId: log.tenantId,
            actorId: log.actorId,
            eventType: log.eventType,
            entityType: log.entityType,
            entityId: log.entityId,

            ...(log.from !== null
                ? {
                    from: log.from as Record<string, unknown>,
                }
                : {}),

            to: log.to as Record<string, unknown>,

            metadata: log.metadata as Record<string, unknown>,

            createdAt: log.createdAt.toISOString(),
        }));
    },
};