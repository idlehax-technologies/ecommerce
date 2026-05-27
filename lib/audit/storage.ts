import type { AuditLog } from "@/types/audit";

type GlobalAudit = typeof globalThis & {
    __auditLogs?: AuditLog[];
};

const globalForAudit = globalThis as GlobalAudit;

const store: AuditLog[] =
    globalForAudit.__auditLogs ?? [];

globalForAudit.__auditLogs = store;

export function appendAudit(log: AuditLog): void {
    store.push(log);
}

// 🔴 READ ONLY API
export function listAuditByTenant(
    tenantId: string,
    limit?: number
): AuditLog[] {

    const all = store
        .filter((l) => l.tenantId === tenantId)
        .slice()
        .reverse()
        .map((l) => ({ ...l }));

    return limit
        ? all.slice(0, limit)
        : all;
}