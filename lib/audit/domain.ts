import { randomUUID } from "crypto";
import { saveAudit } from "./storage";
import type { AuditLog } from "@/types/audit";

export function recordAuditLog(input: {
    tenantId: string;
    actorId: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: Record<string, unknown>;
}): AuditLog {

    const log: AuditLog = {
        auditId: randomUUID(),
        tenantId: input.tenantId,
        actorId: input.actorId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: input.metadata ?? {},
        createdAt: new Date().toISOString(),
    };

    saveAudit(log);

    return log;
}