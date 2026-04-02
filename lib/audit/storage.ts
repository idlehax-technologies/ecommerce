import type { AuditLog } from "@/types/audit";

const globalForAudit = globalThis as unknown as {
    __auditLogs?: AuditLog[];
};

const store: AuditLog[] =
    globalForAudit.__auditLogs ?? [];

globalForAudit.__auditLogs = store;

export function saveAudit(log: AuditLog) {
    store.push(log);
}

export function listAuditByTenant(tenantId: string): AuditLog[] {
    return store.filter(l => l.tenantId === tenantId);
}