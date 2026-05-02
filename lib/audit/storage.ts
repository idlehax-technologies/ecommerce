import type { AuditLog } from "@/types/audit";

type GlobalAudit = typeof globalThis & {
    __auditLogs?: AuditLog[];
};

const globalForAudit = globalThis as GlobalAudit;

const store: AuditLog[] =
    globalForAudit.__auditLogs ?? [];

globalForAudit.__auditLogs = store;

// 🔴 PRIVATE — NOT EXPORTED
function appendAudit(log: AuditLog) {
    store.push(log);
}

// 🔴 READ ONLY API
export function listAuditByTenant(
    tenantId: string,
    limit?: number
): AuditLog[] {
    const all = store
        .filter(l => l.tenantId === tenantId)
        .slice() // avoid mutating original
        .reverse(); // newest first

    return limit ? all.slice(0, limit) : all;
}

// 🔴 INTERNAL EXPORT (ONLY FOR PROJECTOR)
// This keeps it out of public surface but usable internally
export const __internal_appendAudit = appendAudit;