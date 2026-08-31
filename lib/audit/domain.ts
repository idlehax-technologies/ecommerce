import type { AuditLog } from "@/types/audit";

import { auditStore } from "./storage";

export async function appendAudit(
    log: AuditLog
): Promise<void> {

    await auditStore.append(log);
}

export async function getAuditLogs(
    tenantId: string,
    limit?: number
): Promise<AuditLog[]> {

    return auditStore.listByTenant(
        tenantId,
        limit
    );
}