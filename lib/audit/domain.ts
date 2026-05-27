import type { AuditLog }
    from "@/types/audit";

import {
    appendAudit as appendAuditStorage,
    listAuditByTenant as listAuditByTenantStorage,
} from "./storage";

export function appendAudit(
    log: AuditLog
): void {
    appendAuditStorage(log);
}

export function getAuditLogs(
    tenantId: string,
    limit?: number
): AuditLog[] {
    return listAuditByTenantStorage(
        tenantId,
        limit
    );
}